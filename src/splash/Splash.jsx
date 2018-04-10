import * as React from "react"
import { Button } from 'semantic-ui-react'
import './Splash.scss'

export default class Splash extends React.Component {
    render() {
        return <div>
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
                    <div>
                        <Button.Group>
                            <Button size="large">Nouvelle Partie</Button>
                            <Button.Or />
                            <Button size="large" positive>Nouveau Championnat</Button>
                        </Button.Group>
                    </div>
                </div>
            </div>
        </div>;
    }
}