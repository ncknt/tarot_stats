import * as React from 'react'
import {Modal, Header, Button } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom'
import Players from './Players'
import * as axios from 'axios'
import { toast } from 'react-toastify';

class NewGame extends React.Component {

    constructor(props) {
        super(props)
        this.state = { players: [] };
        this.handlePlayersChange = this.handlePlayersChange.bind(this);
        this.handleGo = this.handleGo.bind(this);
    }

    handlePlayersChange(newPlayers) {
        this.setState({players: newPlayers});
    }

    handleGo() {
        let players = this.state.players.reduce((a, p) => {
            if (p) {
                a.push(p);
            }
            return a;
        }, []);
        if (players.length < 3) {
            toast.error('Il nous faut au moins 3 joueurs!');
        } else {
            axios.post('/new', { players }).then(response => {
                let data = response.data;
                this.props.history.push(data.id, data);
                // changeRoute(data.id, 'Partie de Tarot', data);
            }).catch(err => {
                toast.error(`Ca n'a pas marche. Essaie encore.`)
            })
        }
    }

    render() {
        return <div>
            <Header>Qui joue?</Header>
            <Players onChange={this.handlePlayersChange} players={this.state.players}/>
            <div className="push-32">
                <Button onClick={() => this.props.history.goBack()}>Annuler</Button>
                <Button primary onClick={() => this.handleGo()}>C'est Parti</Button>
            </div>
        </div>
    }
}

export default withRouter(NewGame);