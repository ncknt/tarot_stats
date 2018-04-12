import * as React from 'react'
import { Route, Switch } from 'react-router-dom'
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
        let game = history.currentState;
        if (game) {
            this.setGame(game);
        } else {
            let id = this.props.match.params.id
            this.setState({loading: true});
            axios.get(`/${id}/game`).then(response => {
                this.setGame(response.data);
                
            }).catch(err => {
                toast.error(`Pas de jeu ici, verifie l'URL.`)
            })
        }
    }

    setGame(game) {
        // Make a current game if none present
        if (!game.current) {
            game.current = {
                date: new Date(),
                players: game.players.slice(0),
                rounds: []
            }
        }
        this.setState({ loading: false, game });
    }

    render() {
        if (this.state.loading) {
           return (<div id="app-loading">
                <img src="/images/loader.apng"/>
            </div>);
        }
        const id = this.state.game.id;
        return <div className="game-panel">
            <Toolbar active="scores" id={id} />
            <Switch>
                <Route exact path={`/${id}/new`}>
                    <Round current={this.state.game.current} />
                </Route>
                <Route exact path={`/${id}`}>
                    <Scores id={id} current={this.state.game.current} />
                </Route>
            </Switch>
        </div>
    }

}

export default Game;