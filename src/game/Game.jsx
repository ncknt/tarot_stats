import * as React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import Toolbar from './Toolbar'
import * as axios from 'axios'
import { toast } from 'react-toastify';
import Scores from './Scores'
import Round from './Round'
import './Game.scss'

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = { loading: true };
    }

    componentDidMount() {
        // Is the current game in the history state?
        let gameSet = history.currentState;
        if (gameSet) {
            this.setGameSet(games);
        } else {
            let id = this.props.match.params.id
            this.setState({loading: true});
            axios.get(`/${id}/game`).then(response => {
                this.setGameSet(response.data);
                
            }).catch(err => {
                toast.error(`Pas de jeu ici, verifie l'URL.`)
            })
        }
    }

    setGameSet(gameSet) {
        // Check the last game and start a new one if old or none
        let games = gameSet.games;
        let game = games.length && games[games.lenght - 1];

        if (!game || game.endedAt || new Date(game.startedAt).getTime() < Date.now() - 86400000) {
            // Start new game if none so far, marked as ended or more than a day old
            game = {
                startedAt: new Date().toISOString(),
                rounds: [],
                totals: []
            }
        }
        this.setState({ loading: false, game, gameSet });
    }

    render() {
        if (this.state.loading) {
           return (<div id="app-loading">
                <img src="/images/loader.apng"/>
            </div>);
        }
        const id = this.state.gameSet.id;
        return <div className="game-panel">
            <Toolbar active="scores" id={id} />
            <Switch>
                <Route exact path={`/${id}/new`}>
                    <Round current={this.state.game} players={this.state.gameSet.players} />
                </Route>
                <Route exact path={`/${id}/scores`}>
                    <Scores id={id} current={this.state.game} players={this.state.gameSet.players} />
                </Route>
                <Route exact path={`/${id}`}>
                    <Redirect to={`/${id}/scores`} />
                </Route>
            </Switch>
        </div>
    }

}

export default Game;