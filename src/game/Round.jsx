import * as React from 'react'
import update from 'react-addons-update';
import { Header, Dropdown, Button, Grid, Rating, Container, Menu, Input } from 'semantic-ui-react'
import { CONTRACTS, CHIENS, SUITS } from '../utils/constants'
import RoundResult from './RoundResult'
import { basePoints, petitAuBout, pointsNeeded, computeScores } from '../utils/rules'

import './Round.scss'

class Round extends React.Component {

    constructor(props) {
        super(props)
        this.state = { playing: false, skip: [] };
        this.skipper = this.skipper.bind(this);
        this.finish = this.finish.bind(this);
    }

    componentWillMount() {
        const players = this.props.players;        
        if (players.length <= 5) {
            this.setState({ players })
        }
    }

    /**
     * If we have more than 5 players, ask who's skipping turn until enough players skip turn
     */
    skipper() {
        const players = this.props.players;
        const tryingToPlay = players.length - this.state.skip.length;

        if (tryingToPlay > 5) {
            const onSkip = (player) => {
                let newState = { skip: { $push: player } };

                if (tryingToPlay === 6) {
                    // We have enough people skipping turn
                    newState.players = players.filter(p => this.state.skip.indexOf(p) === -1);
                }
                this.setState(newState);
            }
            return <Grid columns={4}>
                {players.map((player, index) => (<Grid.Column key={index}><Button basic color="purple" onClick={() => onSkip(player)}>{player}</Button></Grid.Column>)) }
            </Grid>
        }
    }

    /**
     * Who's bidding? Or show who the bidder is
     */
    bidder() {
        const bidderOptions = this.state.players.map(p => ({value: p, text: p}));
        return <Dropdown item disabled={this.state.playing} placeholder="Preneur" options={bidderOptions} value={this.state.bidder} onChange={(e, data) => this.setState({ bidder: data.value })}/>
    }

    /**
     * What contract was selected? or show the selected contract
     */
    contract() {
        if (this.state.bidder) {
            const contractOptions = CONTRACTS.map(({val, lab}) => ({text: lab, value: val}));
            return <Dropdown item disabled={this.state.playing} placeholder="Contrat" options={contractOptions} onChange={(e, data) => this.setState({ contract: data.value })}/>
        }
        return <div></div>
    }

    suitCalled() {
        if (this.state.players.length === 5) {
            if (!this.state.contract) {
                return <div></div>;
            }
            const suitString = (suitCode) => suitCode.replace(/\\u(\w\w\w\w)/g, (a, b) => String.fromCharCode(parseInt(b, 16)));
            const suits = Object.keys(SUITS);
            const suitOptions = suits.map(suitValue => ({ text: `${SUITS[suitValue].lab} (${suitString(SUITS[suitValue].code)})`, value: suitValue }));
            return <Dropdown disabled={this.state.playing} item placeholder="Appel" options={suitOptions} onChange={(e, data) => this.setState({ suitCalled: data.value })} />
        }
    }

    /**
     * How good is the "chien"?
     */
    leDog() {
        // Ask only if not playing, it's shown and the suit has been called if applicable
        if (!this.state.playing && this.state.contract && 
            (this.state.contract !== 'GS' && this.state.contract !== 'GC') && 
                (this.state.players.length !== 5 || this.state.suitCalled)) {
            const onRate = (e, { rating, maxRating }) => this.setState({ chien: rating });
            return <div className="push-32">
                <Header>Comment est le chien?</Header>
                <Rating maxRating={5} onRate={onRate} />
            </div>
        }
    }

    /**
     * Any annonces?
     */
    annonces() {
        if (!this.state.playing && this.state.contract && (this.state.players.length !== 5 || this.state.suitCalled)) {
            return <div>
                <Header>Des annonces?</Header>
                <Grid columns={2}>
                    <Grid.Column>
                        <div className="ui toggle checkbox">
                            <input type="checkbox" checked={this.state.chelem} onChange={() => this.setState({ chelem: true })} />
                            <label>Grand Chelem</label>
                        </div>
                    </Grid.Column>
                    <Grid.Column>
                        <div className="ui toggle checkbox">
                            <input type="checkbox" checked={this.state.poignee} onChange={() => this.setState({ poignee: true })} />
                            <label>Poignee</label>
                        </div>
                    </Grid.Column>
                </Grid>
            </div>
        }
    }

    /**
     * Any annonces?
     */
    specialCase() {
        if (!this.state.playing && this.state.contract && (this.state.players.length !== 5 || this.state.suitCalled)) {
            return <div>
                <Grid columns={2}>
                    <Grid.Column>
                        <div className="ui toggle checkbox">
                            <input type="checkbox" checked={this.state.petitAuBout} onChange={() => this.setState({petitAuBout: true})} />
                            <label>Petit au bout</label>
                        </div>
                    </Grid.Column>
                </Grid>
            </div>
        }
    }

    /**
     * Who is called?
     */
    sidekick() {
        if (this.state.playing && this.state.players.length === 5) {
            if (this.state.sidekick) {
                return <Grid columns={2} className="no-space">
                    <Grid.Column>
                        {this.state.sidekick} est appelé.
                    </Grid.Column>
                    <Grid.Column textAlign="right">
                        <Button icon="undo" basic onClick={() => this.setState({ sidekick: null })} />
                    </Grid.Column>
                </Grid>
            }
            const onTap = (player) => this.setState({ sidekick: player })
            return <div>
                <Header>Qui a été appelé?</Header>
                <Grid columns={4} stackable>
                    {this.state.players.map((player, index) => (<Grid.Column key={index}><Button basic color="purple" onClick={() => onTap(player)}>{player}</Button></Grid.Column>))}
                </Grid>
            </div>
        }
    }

    result() {
        if (this.state.players.length !== 5 || this.state.sidekick) {
            const { contract, points, petit, twentyOne, excuse, grandChelem } = this.state;
            let oudlers = 0;
            if (petit) oudlers++;
            if (excuse) oudlers++;
            if (twentyOne) oudlers++;
            let base = basePoints(contract, points, oudlers, grandChelem);

            return <div>
                <Grid columns={3} className="push-32">
                    <Grid.Column>
                        <Button basic toggle active={twentyOne} onClick={() => this.setState({ twentyOne: !twentyOne })}>21</Button>
                    </Grid.Column>
                    <Grid.Column>
                        <Button basic toggle active={excuse} onClick={() => this.setState({ excuse: !excuse })}>Excuse</Button>
                    </Grid.Column>
                    <Grid.Column>
                        <Button basic toggle active={petit} onClick={() => this.setState({ petit: !petit })}>Petit</Button>
                    </Grid.Column>
                </Grid>
                <RoundResult className="push-32" onResult={(attackPoints) => this.setState({ points: attackPoints })} points={points || pointsNeeded(2)} />
                {!!base && 
                    <div className="push-32">
                        Points de base: <span className={`ui basic label ${base > 0 ? 'green' : 'red'}`}>{base}</span>
                    </div>
                }
            </div>
        }
    }

    /**
     * Count the points and add to the overall game
     */
    finish() {
        const { contract, bidder, sidekick, players, points, twentyOne, petit, excuse, grandChelem } = this.state;
        let oudlers = 0;
        if (petit) oudlers++;
        if (excuse) oudlers++;
        if (twentyOne) oudlers++;

        let base = basePoints(contract, points, oudlers, grandChelem);
        let scores = computeScores(players, base, bidder, sidekick);
        if (this.state.petitAuBout) {
            let pb = petitAuBout(contract, this.state.petitAuBout);
            let pbScores = computeScores(players, pb, bidder, sidekick);
            // Add the petit au bout scores
            players.forEach(p => {
                scores[p] += pbScores[p]
            });
        }
        let round = { ...this.state, scores, oudlers, duration: 0};
        delete round.playing;
        delete round.skip;
        delete round.players;
        this.props.onRoundFinish(round);
    }

    render() {
        return (<div>
            <Header>Nouvelle Partie</Header>
            {
                this.state.players &&
                <Menu size="large" borderless fluid widths={this.state.players.length === 5 ? 3 : 2}>
                    {this.bidder()}
                    {this.contract()}
                    {this.suitCalled()}
                </Menu>
            }
            {
                this.state.playing &&
                <div>
                    {this.sidekick()}
                    {this.specialCase()}
                    {this.result()}
                </div>
            }
            { !this.state.players && this.skipper() }
            { this.annonces() }
            { this.leDog() }
            {!this.state.playing && this.state.bidder && this.state.contract &&
                (this.state.players.length !== 5 || this.state.suitCalled) &&
                <Container className="push-32" textAlign="center"><Button primary basic size="big" onClick={() => this.setState({ playing: true })}>Jouer!</Button></Container>
            }
            { this.state.playing && (!this.state.suitCalled || this.state.sidekick) &&
                <Container className="push-32" textAlign="center"><Button primary disabled={this.props.saving} loading={this.props.saving} basic size="big" onClick={() => this.finish()}>Valider</Button></Container>
            }
        </div>);
    }
}

export default Round;