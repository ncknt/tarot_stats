import * as React from 'react'
import { Table, Button, Header, Container, Icon } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import { pointsNeeded } from '../utils/rules'
import RoundView from './RoundView'
import GameRanks from './GameRanks'
import './Scores.scss'

class Scores extends React.Component {

    constructor(props) {
        super(props)
        this.state = { roundOpen: null };
        this.showRound = this.showRound.bind(this);
    }

    showRound(roundIndex) {
        this.props.history.push(`/${this.props.current.championship}/rounds/${roundIndex}`);
    }

    cellClass(player, round) {
        if (player === round.bidder) {
            if (round.scores[player] > 0) {
                return 'bidder-win';
            }
            return 'bidder-loss';

        } else if (player === round.sidekick) {
            if (round.scores[player] > 0) {
                return 'sidekick-win';
            }
            return 'sidekick-loss';
        }
    }

    render() {
        const {rounds, totals} = this.props.current;
        const players = this.props.players;

        return <div className="scores">
            {/* <Header as="h4">{this.props.current.date.toLocaleDateString()}</Header> */}
            <Table celled unstackable>
                <Table.Header>
                    <Table.Row>
                        {
                            players.map(p => (
                                <Table.HeaderCell key={p}>{p}</Table.HeaderCell>
                            ))
                        }
                        <Table.HeaderCell>Contrat</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {
                        rounds.map((round, idx) => (
                            <Table.Row key={idx} onClick={() => this.showRound(idx)}>
                                {
                                    players.map((p, j) => (<Table.Cell key={j} className={this.cellClass(p, round)}>{round.scores[p]}</Table.Cell>))
                                }
                                <Table.Cell>{round.contract} ({round.points - pointsNeeded(round.oudlers)})</Table.Cell>
                            </Table.Row>
                        ))
                    }
                    {
                        !!rounds.length &&
                        <Table.Row>
                            {
                                players.map((p, j) => (<Table.Cell key={j}><strong>{totals[p]}</strong></Table.Cell>))
                            }
                        </Table.Row>
                    }
                </Table.Body>
            </Table>
            {
                rounds.length ?
                    <GameRanks players={players} game={this.props.current} /> :
                    <Container textAlign="center"><Header>Pas encore de partie!</Header></Container>
            }
            <Button circular size="massive" color='google plus' icon='plus' className="newGame" onClick={() => this.props.history.push(`/${this.props.id}/new`)}/>
        </div>
    }
}

export default withRouter(Scores);