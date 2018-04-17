import * as React from 'react'
import { Statistic, Table, Grid, Header, Container, Button, Confirm } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import { CONTRACTS, SUITS } from '../utils/constants'
import { pointsNeeded } from '../utils/rules'

class RoundView extends React.Component {

    constructor(props) {
        super(props)
        this.state = { open: false }
    }

    render() {
        if (!round) {
            return <div id="app-loading"><img src="/images/loader.apng" /></div>
        }
        const { game, players } = this.props;
        const roundIndex = parseInt(this.props.match.params.rId, 10);
        const round = game.rounds[roundIndex];
        const contract = CONTRACTS.find(i => i.val === round.contract).lab;
        var oudlers = 0;
        if (round.twentyOne) oudlers++;
        if (round.petit) oudlers++;
        if (round.excuse) oudlers++;
        const ptsNeeded = pointsNeeded(oudlers)

        return (
            <div>
                <Header>Partie {roundIndex + 1}</Header>
                <Confirm content="Voulez-vous vraiment effacer la partie?"
                    onCancel={() => this.setState({ open: false })}
                    open={this.state.open}
                    onConfirm={() => this.props.onRoundDelete(roundIndex)}/>
                <div className="push-32">
                    {round.bidder} a pris une {contract}
                {
                    round.sidekick && 
                    <span> et a appele {round.sidekick} ({SUITS[round.suitCalled].code})</span>
                    }. L'attaque totalise {round.points} points pour {ptsNeeded}.
                </div>
                <div className="push-32">
                    <strong>
                    {
                        (round.points >= ptsNeeded) ?
                            <strong>La partie est faite de {round.points - ptsNeeded}</strong> :
                            <strong>La partie est chutee de {ptsNeeded - round.points}</strong>
                    }
                    </strong>
                </div>
                <Table definition>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell />
                            {
                                players.map(p => (
                                    <Table.HeaderCell key={p}>{p}</Table.HeaderCell>
                                ))
                            }
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        <Table.Row>
                            {
                                players.map((p, j) => (<Table.Cell key={j}>{round.scores[p]}</Table.Cell>))
                            }
                        </Table.Row>
                    </Table.Body>
                </Table>
                <Grid className="push-32" columns={2} textAlign="center">
                    <Grid.Column>
                        <Button basic onClick={this.props.history.goBack}>Revenir</Button>
                    </Grid.Column>
                    <Grid.Column>
                        <Button color="red" onClick={() => this.setState({ open: true })}>Effacer la Partie</Button>
                    </Grid.Column>
                </Grid>
            </div>
        )
    }
}

export default withRouter(RoundView)