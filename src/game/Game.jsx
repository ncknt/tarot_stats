import * as React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import Toolbar from './Toolbar'
import * as axios from 'axios'
import { toast } from 'react-toastify';
import Scores from './Scores'
import Round from './Round'
import { withRouter } from 'react-router-dom'
import persistence from '../utils/persistence'
import update from 'react-addons-update';

import './Game.scss'

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = { loading: true };
        this.roundFinished = this.roundFinished.bind(this);
        this.onGameUpdate = this.onGameUpdate.bind(this);
    }

    async componentDidMount() {
        // Is the current game in the history state?
        let id = this.props.match.params.id
        try {
            const doc = await persistence().collection('championships').doc(id).get();
            this.setChampionship(doc);
        } catch(err) {
            toast.error(`Pas de jeu ici, verifie l'URL.`)
        }
    }

    async setChampionship(cDoc) {
        // Check the last game and start a new one if old or none
        let championship = cDoc.data();
        let game;
        if (championship.currentGame) {
            let gameDoc = await persistence().doc(`games/${championship.currentGame}`).get();
            game = gameDoc.data()
            this.startGame(championship, cDoc.id, game, gameDoc.id);
        } else {
            // Start new game if none so far, marked as ended or more than a day old
            game = { startedAt: new Date().toISOString(), rounds: [], totals: [] }
            this.saveCurrentGame(game, championship, cDoc.id);
        }
    }

    onGameUpdate(doc) {
        // Update local
        const game = doc.data();
        if (game) {
            console.log("Current data: ", game);
            this.setState({ game })
        }
    }

    startGame(championship, championshipId, game, gameId) {
        // Start listening to changes
        persistence().collection('games').doc(gameId)
            .onSnapshot(this.onGameUpdate);
        this.setState({ loading: false, game, championship, cId: championshipId, gId: gameId });        
    }

    async saveCurrentGame(game, championship, championshipId) {
        try {
            // Save game
            let gDocRef = await persistence().collection('games').add(game);
            const gameId = gDocRef.id;
            // Keep reference to the game as current
            await persistence().doc(`championships/${championshipId}`).set({currentGame: gameId}, { merge: true });
            this.startGame(championship, championshipId, game, gameId);
        } catch (err) {
            console.log(err);
            toast.error('Oops pas pu sauver.')
        }
    }

    async roundFinished(round) {
        this.setState({saving: true});
        // Compute the new totals
        const game = this.state.game;
        let scores = round.scores;

        let newTotals = this.state.championship.players.reduce((h, p) => {
            h[p] = (game.totals[p] || 0) + (scores[p] || 0);
            return h;
        }, {});

        // Save the round
        let rounds = game.rounds.slice(0);
        rounds.push(round);

        await persistence().doc(`games/${this.state.gId}`).set({
            rounds,
            totals: newTotals
        }, { merge: true });

        // Update the state
        const newGame = {
            ...game,
            totals: newTotals,
            rounds
        }

        try {
            this.setState({game: newGame, saving: false});
            this.props.history.push(`/${this.state.cId}/scores`);
        } catch (err) {
            console.log(err);
            toast.error('Pas pu sauver. Essaie encore.')
        }
    }

    render() {
        if (this.state.loading) {
           return (<div id="app-loading">
                <img src="/images/loader.apng"/>
            </div>);
        }
        const id = this.state.cId;
        return <div className="game-panel">
            <Toolbar active="scores" id={id} />
            <Switch>
                <Route exact path={`/${id}/new`}>
                    <Round current={this.state.game} players={this.state.championship.players} onRoundFinish={this.roundFinished} saving={this.state.saving}/>
                </Route>
                <Route exact path={`/${id}/scores`}>
                    <Scores id={id} current={this.state.game} players={this.state.championship.players} />
                </Route>
                <Route exact path={`/${id}`}>
                    <Redirect to={`/${id}/scores`} />
                </Route>
            </Switch>
        </div>
    }

}

export default withRouter(Game);