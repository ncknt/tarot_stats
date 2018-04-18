import * as React from "react"
import Splash from './splash/Splash'
import Game from './game/Game'
import { ToastContainer } from 'react-toastify'
import { BrowserRouter, Route, IndexRoute, Switch } from 'react-router-dom'

import 'semantic-ui/dist/semantic.css'
import './App.scss'


export default class App extends React.Component {

    render() {
        return <div>
            <ToastContainer />
            <BrowserRouter>
                <Switch>
                    <Route path="/:id" component={Game} />
                    <Route exact path="/" component={Splash} />
                </Switch>
            </BrowserRouter>
        </div>
    }
}