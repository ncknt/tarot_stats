import * as React from 'react'
import ScoreLines from './ScoreLines'
import { schemeCategory10 } from 'd3'
import StatsPlayerHeader from './StatsPlayerHeader'

class GameStats extends React.Component {

    constructor(props) {
        super(props)
        // Assign a color to each players so we use them consistently across charts
        this.state = { cPlayers: this.props.players.map((p, idx) => ({ player: p, color: schemeCategory10[idx % 10]})) }
    }

    render() {
        return <div>
            <StatsPlayerHeader cPlayers={this.state.cPlayers} />
            <ScoreLines cPlayers={this.state.cPlayers} game={this.props.game} />
        </div>
    }
}

export default GameStats