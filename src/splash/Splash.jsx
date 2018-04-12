import * as React from "react"
import { Button } from 'semantic-ui-react'
import RouteContext from '../utils/RouteContext'
import NewGame from '../game/NewGame'
import './Splash.scss'

export default class Splash extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (<div>
            <div className="stripes">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div className="splash-content">
                <div className="splash-content-inner">
                    <h1>Compteur de tarot</h1>
                    <div className="push-32">
                        {this.state.newGame ? <NewGame onCancel={() => this.setState({ newGame: false })}/> : 
                            <Button size="large" primary onClick={() => this.setState({newGame: true})}>Nouvelle Partie</Button>
                        }
                    </div>
                </div>
            </div>
        </div>);
    }
}