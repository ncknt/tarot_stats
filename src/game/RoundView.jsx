import * as React from 'react'
import { Statistic, Table, Grid, Header, Container, Button, Confirm } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import { CONTRACTS, SUITS } from '../utils/constants'
import { pointsNeeded, poigneeDescription } from '../utils/rules'
import { rankInFrench, getRank } from '../utils/text'

class RoundView extends React.Component {

    constructor(props) {
        super(props)
        this.state = { open: false }
    }

    player(round, players, player, index, intermediateTotals) {
        return <div key={index}>
            {player} marque {round.scores[player] || 0} points et est {rankInFrench(getRank(player, players, intermediateTotals))}.
        </div>
    }

    render() {
        const { game, players } = this.props;
        const roundIndex = parseInt(this.props.match.params.rId, 10);
        const round = game.rounds[roundIndex];

        if (!round) {
            return <div id="app-loading"><img src="/images/loader.apng" /></div>
        }
        const contract = CONTRACTS.find(i => i.val === round.contract).lab;
        var oudlers = 0;
        if (round.twentyOne) oudlers++;
        if (round.petit) oudlers++;
        if (round.excuse) oudlers++;
        const ptsNeeded = pointsNeeded(oudlers)

        // Compute ranks at that point
        const intermediateTotals = players.reduce((h, p) => {
            const total = game.rounds.reduce((total, round, idx) => {
                if (idx <= roundIndex) {
                    return total + (round.scores[p] || 0);
                }
                return total;
            }, 0);
            h[p] = total;
            return h;
        }, {});

        return (
            <Container>
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
                    {
                        round.poignee && <span> {poigneeDescription(round.poignee)} annoncee!</span>
                    }
                    {
                        round.petitAuBout && <span> Le petit a ete mis au bout.</span>
                    }
                </div>
                <div className="push-32 push-up-32">
                    <strong>
                    {
                        (round.points >= ptsNeeded) ?
                            <span>La partie est faite de {round.points - ptsNeeded}</span> :
                            <span>La partie est chutee de {ptsNeeded - round.points}</span>
                    }.
                    </strong>
                    {
                        round.grandChelem &&
                            (round.points === 91 ? <span>Grand chelem annonce et fait!</span> :
                                <span>Grand chelem annonce mais rate.</span>)
                    }
                </div>
                {
                    players.map((p, idx) => this.player(round, players, p, idx, intermediateTotals))
                }
                <div className="push-32">
                    <Grid columns={2} textAlign="center">
                        <Grid.Column>
                            <Button basic onClick={this.props.history.goBack}>Retour</Button>
                        </Grid.Column>
                        <Grid.Column>
                            <Button color="red" onClick={() => this.setState({ open: true })}>Effacer la Partie</Button>
                        </Grid.Column>
                    </Grid>
                </div>
            </Container>
        )
    }
}

export default withRouter(RoundView)