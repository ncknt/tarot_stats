import * as React from 'react'
import { Card } from 'semantic-ui-react'
import { getRank, rankInFrench } from '../utils/text'

class GameRanks extends React.Component {
    
    constructor(props) {
        super(props)
    }

    timesBidder(player, game) {
        return game.rounds.reduce((total, round) => round.bidder === player ? total + 1 : total, 0);
    }

    timesCalled(player, game) {
        return game.rounds.reduce((total, round) => round.sidekick === player && round.bidder !== player ? total + 1 : total, 0);
    }

    render() {
        const {players, game} = this.props;
        const scoreList = players.map(p => ({ points: game.totals[p], player: p}));
        scoreList.sort((a, b) => (a.points - b.points) || (a.player.localeCompare(b.player)));

        return <div className="push-32">
            {scoreList.map(({player, points}, idx) => {
                return <Card key={idx}>
                    <Card.Content header={`${rankInFrench(getRank(player, players, game.totals))} - ${player}`} />
                    <Card.Meta>
                        {points} points - {this.timesBidder(player, game)} prises
                        {players.length === 5 && <span> - {this.timesCalled(player, game)} appels</span>}
                    </Card.Meta>
                    <Card.Description>
                        Besoin d'une Garde faite de 30 pour passer 1er.
                    </Card.Description>
                </Card>
            })}
        </div>
    }
}