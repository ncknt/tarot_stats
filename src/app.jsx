import * as React from "react"
import 'semantic-ui/dist/semantic.min.css'
import './App.scss'
import Splash from './splash/Splash'
import Game from './game/Game'
import RouteContext from './utils/RouteContext'
import { ToastContainer } from 'react-toastify'

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.changeRoute = this.changeRoute.bind(this);
        this.state = {
            pathname: props.pathname || '/'
        }
    }

    changeRoute(newRoute, title, data) {
        history.pushState(data, title, newRoute);
        this.setState({pathname: newRoute})
    }

    componentDidMount() {
        window.onpopstate = () => {
            this.setState({pathname: location.pathname });
        }
    }

    render() {
        const Page = this.state.pathname === '/' ? Splash : Game;
        return <RouteContext.Provider value={{pathname: this.state.pathname, changeRoute: this.changeRoute}}>
            <ToastContainer />
            <Page/>
        </RouteContext.Provider>;
    }
}