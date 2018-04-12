import * as React from 'react'
import RouteContext from '../utils/RouteContext'
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
        this.handleRouteChange = this.handleRouteChange.bind(this);
    }

    componentDidMount() {
        // Is the current game in the history state?
        let game = history.currentState;
        if (game) {
            this.setGame(game);
        } else {
            // Get the ID from the path
            let pathname = location.pathname;
            let idx = pathname.indexOf('/', 1);
            let id = ~idx ? pathname.substring(1, idx) : pathname.substring(1);
            this.setState({loading: true});
            axios.get(`/${id}/game`).then(response => {
                this.setGame(response.data);
                
            }).catch(err => {
                toast.error(`Pas de jeu ici, verifie l'URL.`)
            })
        }
    }

    setGame(game) {
        // Make a current game
        if (!game.current) {
            game.current = {
                date: new Date(),
                players: game.players.slice(0),
                rounds: []
            }
        }
        this.setState({ loading: false, game });
    }

    handleRouteChange(route, pathname, changeRoute) {
        changeRoute(pathname + '/' + route);
    }

    getScreen(pathname, changeRoute) {
        let idx = pathname.indexOf('/');
        let screen = pathname.substring(idx + 1);
        switch(screen) {
            case 'new':
                return <Round current={this.state.game.current} />
            case 'stats':
            case 'saison':
            default:
                return <Scores current={this.state.game.current} onNewRound={() => this.handleRouteChange('new', pathname, changeRoute)} />;
        }
    }

    render() {
        if (this.state.loading) {
           return (<div id="app-loading">
                <img src="/images/loader.apng"/>
            </div>);
        }
        
        return <RouteContext.Consumer>
            {
                ({ changeRoute, pathname}) => {
                    return (<div className="game-panel">
                        <Toolbar active="scores" onRouteChange={(route) => this.handleRouteChange(route, pathname, changeRoute)} />
                        {this.getScreen(pathname, changeRoute)}
                    </div>)
                }
            }
        </RouteContext.Consumer>;
    }

}

export default Game;