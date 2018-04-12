import * as React from 'react'
import update from 'react-addons-update';

import { Header, Dropdown, Button } from 'semantic-ui-react'

class Round extends React.Component {

    constructor(props) {
        super(props)
        this.state = { playing: false, skip: [] };
        this.skipper = this.skipper.bind(this);
    }

    skipper() {
        const players = this.props.current.players;
        const onSkip = (player) => {
            this.setState({skip: {$push: player}})
        }
        if (players.length > 5 - this.state.skip.length) {
            return this.props.current.players.map((player, index) => {
                return <Button key={index} basic color="purple" onClick={() => onSkip(player)}>{player}</Button>
            })
        }
    }

    render() {
        if (this.state.playing) {

        }
        return <div>
            <Header>Nouvelle Partie</Header>
            { this.skipper() }
        </div>
    }
}

export default Round;