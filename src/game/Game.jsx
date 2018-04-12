import * as React from 'react'
import RouteContext from '../utils/RouteContext'
import Toolbar from './Toolbar'
import * as axios from 'axios'
import { toast } from 'react-toastify';

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = { };
        this.handleRouteChange = this.handleRouteChange.bind(this);
    }

    componentDidMount() {
        // Is the current game in the history state?
        let game = history.currentState;
        if (game) {
            this.setState({game});
        } else {
            // Get the ID from the path
            let pathname = location.pathname;
            let idx = pathname.indexOf('/');
            let id = ~idx ? pathname : pathname.substring(0, idx);
            this.setState({loading: true});
            axios.get(`${id}/game`).then(response => {
                this.setState({loading: false, game: response.data});
            }).catch(err => {
                toast.error(`Pas de jeu ici, verifie l'URL.`)
            })
        }
    }

    handleRouteChange(e, pathname, changeRoute) {
        let goto = e.target.name;
        changeRoute(pathname + '/' + goto, goto);
    }

    render() {
        return <RouteContext.Consumer>
            {
                ({ changeRoute, pathname}) => {
                    return (<div>Looking at game for path {pathname}.
                        <Toolbar active="scores" onRouteChange={(e) => this.handleRouteChange(e, pathname, changeRoute)} />
                    </div>)
                }
            }
        </RouteContext.Consumer>;
    }

}

export default Game;