import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
from scipy.stats import norm
from sklearn.preprocessing import StandardScaler
from scipy import stats
import warnings
import re
import math
from datetime import datetime
import os
warnings.filterwarnings('ignore')
# %matplotlib inline

# from IPython import get_ipython
# get_ipython().run_line_magic('matplotlib', 'inline')

scores = pd.read_excel('./data/scores2.xlsx', sheet_name=None)
sns.set() # Make it pretty
# Clean up
del scores['New']
scores['03-15'] = scores['0315']
scores['03-29'] = scores['0329']
del scores['0315']
del scores['0329']
days = list(scores.keys())

players = ['Nico', 'Bertrand', 'Olivier', 'Vincent', 'Arnaud']
contrats = ['P', 'G', 'GS', 'GC']

def preneur(row):
    for p in players:
        if row[p] == 2 or row[p] == 4:
            return p
    return None

def appelle(row):
    for p in players:
        if row[p] == 1:
            return p
    return None

def translate_day(day):
    numbers = re.findall(r'\d+', day)
    today = datetime.today()
    if len(numbers[1]) == 1:
        numbers[1] = "0" + numbers[1]
    parsed = datetime.strptime("{0}-{1}-{2}".format(numbers[1], numbers[0], today.year), "%d-%m-%Y")
    if parsed > today:
        return datetime.strptime("{0}-{1}-{2}".format(numbers[1], numbers[0], today.year - 1), "%d-%m-%Y")
    return parsed


def inspect_score_cols(day, df_dict, scores_df):
    df = df_dict[day]
    # If all players are here
    if len(df.columns & set(players)) == len(players):
        cols = list(df.columns.values)
        # Rename the columns
        df = df.replace(['Garde Sans', 'Petite', 'Garde', 'Garde Contre', 'p'], ['GS', 'P', 'G', 'GC', 'P'])
        df['Preneur'] = df.apply(lambda row: preneur(row), axis = 1)
        df['Day'] = translate_day(day)
        df['Appelle'] = df.apply(lambda row: appelle(row), axis = 1)
        colMap = {}
        for p in players:
            idx = cols.index(p)
            if idx:
                colMap[cols[idx + 1]] = p
        df = df.filter(['Contrat', 'Preneur', 'Appelle', 'Day'] + list(colMap.keys())).rename(colMap, axis="columns")
        scores_df = scores_df.append(df)
        print(df)
    return scores_df

def transform_scores(scores):
    scores_df = pd.DataFrame()
    for d in days:
        scores_df = inspect_score_cols(d, scores, scores_df)
    # Remove any n/a line
    scores_df = scores_df.dropna(subset=['Contrat'])
    # Remove "Total"
    scores_df = scores_df[scores_df['Contrat'] != 'Total']
    return scores_df

def save_image(name):
    path = os.path.join(os.getcwd(), 'output', name)
    plt.savefig(path, format='png', frameon=False)

def check_prises(scores_df):
    prises = scores_df.filter(['Preneur', 'Contrat']).groupby(['Preneur']).count()
    results['FrequentPreneurs'] = prises['Contrat'].to_json()
    pt = prises.transpose()
    pt.loc['Contrat'].sort_values().plot(kind='bar')
    plt.xticks(rotation=50)
    save_image('prises.png')

def popular_contracts(scores_df):
    cf = scores_df.filter(['Contrat', 'Day']).groupby('Contrat').count()
    results['PopularContracts'] = cf['Day'].to_json()
    cf.plot(kind='bar')
    plt.legend().set_visible(False)
    save_image('popular_contracts.png')

def check_who_takes_what(scores_df):
    c_results = {}
    for c in contrats:
        cf = scores_df.loc[scores_df['Contrat'] == c].filter(['Contrat', 'Preneur']).groupby('Preneur').count()
        # c_results[c] = cf.to_json()
        cf.plot(kind='bar')
        plt.suptitle('Qui a pris des ' + c)
        plt.xticks(rotation=50)
        save_image('frequent_preneur' + c + '.png')

def all_contracts(scores_df):
    ag = scores_df.groupby(['Preneur', 'Contrat']).count().filter(['Day']).unstack()
    ag.columns = ag.columns.droplevel()
    ag.plot(kind='bar')
    plt.xticks(rotation=50)
    plt.suptitle('Les contrats par joueur')
    save_image('contrat_par_preneur.png')

def morpions(scores_df):
    scores_df.groupby(['Appelle']).count().filter(['Day', 'Appelle']).plot(kind='bar')
    plt.suptitle('La course au morpion')
    plt.xticks(rotation=50)
    save_image('morpion.png')

def favorite_pairs(scores_df):
    appels = scores_df.groupby(['Preneur', 'Appelle']).count().filter(['Preneur', 'Appelle', 'Contrat'])
    x = appels.unstack()
    x.columns = x.columns.droplevel()
    x.plot(kind='bar')
    plt.suptitle('Qui appelle qui?')
    plt.xticks(rotation=50)
    save_image('favorite_pairs.png')
    # Now show the first and last 3 pairs
    x = appels.sort_values(ascending=False, by='Contrat')
    results['Freq3Pairs'] = x['Contrat'].head(3)
    results['LeastFreq3Pairs'] = x['Contrat'].tail(3)

def morpion_by_contrat(scores_df):
    morps = scores_df.groupby(['Appelle', 'Contrat']).count().filter(['Preneur', 'Appelle', 'Contrat'])
    x = morps.unstack()
    x.columns = x.columns.droplevel()
    x.plot(kind='bar')
    plt.suptitle('Nombre d\'appels par contrat')
    # plt.legend(['Morpion par contrat'])
    plt.xticks(rotation=50)
    save_image('morpion_contrat.png')

def ranks(scores_df):
    results['LeaderboardPts'] = scores_df.sum()[1:6].sort_values(ascending=False).to_json()
    # Winner by date
    x = scores_df.groupby('Day').sum()
    results['ResultsByDay'] = x.to_json(date_format='iso')
    # Ranks by date
    y = x.rank(axis=1, ascending=False, method='min')
    results['RankByDay'] = y.to_json(date_format='iso')    
    # Overall rank
    results['LeaderboardRank'] = y.sum().sort_values().to_json()
    # Chart of total points
    x.cumsum().plot()
    plt.suptitle('Leaderboard par points totaux')    
    save_image('leaderboard_pts.png')
    # Chart of rank
    y.cumsum().rank(axis=1, ascending=False).plot()
    plt.suptitle('Leaderboard par rang apres chaque jour')
    save_image('leaderboard_rank.png')    


scores_df = transform_scores(scores)
results = {}
results['Players'] = players
check_prises(scores_df)
popular_contracts(scores_df)
check_who_takes_what(scores_df)
all_contracts(scores_df)
favorite_pairs(scores_df)
morpion_by_contrat(scores_df)

# scores
ranks(scores_df)

