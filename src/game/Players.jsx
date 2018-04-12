import * as React from 'react';
import { Input } from 'semantic-ui-react'
import update from 'react-addons-update';

class Players extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        let players = nextProps.players ? nextProps.players.slice(0) : [];
        // Make sure we have one more non empty one
        for (; players.length < 3 || players[players.length - 1];) {
            players.push('');
        }
        return { players };
    }

    handleChange(index, event) {
        let players = this.state.players;
        let val = event.target.value;
        this.props.onChange(update(players, { [index]: { $set: val } }));
    }

    render() {
        return <div>
        {
            this.state.players.map((player, index) => (
                <div key={index}>
                    <Input size="big" placeholder={`Joueur ${index + 1}`} onChange={(e) => this.handleChange(index, e)} value={player}/>
                </div>
            ))
        }
        </div>;
    }
}

export default Players;