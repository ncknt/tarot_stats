import * as React from 'react'
import update from 'react-addons-update';
import { Header, Dropdown, Button, Grid, Rating, Container, Menu, Input } from 'semantic-ui-react'
import { CONTRACTS, CHIENS, SUITS } from '../utils/constants'
import RoundResult from './RoundResult'
import { basePoints, petitAuBout, pointsNeeded, computeScores } from '../utils/rules'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import './Round.scss'

class Round extends React.Component {

    constructor(props) {
        super(props)
        this.state = { playing: false, skip: [] };
        this.skipper = this.skipper.bind(this);
        this.finish = this.finish.bind(this);
        this.play = this.play.bind(this)
        this.cancel = this.cancel.bind(this)
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
        return <Grid columns={12} stackable>
            <Grid.Column width={4}><strong>Preneur</strong></Grid.Column>
            <Grid.Column width={8}>
                <Button.Group compact>
                    {
                        this.state.players.map((p, idx) => (<Button key={idx} basic={ p !== this.state.bidder } primary onClick={() => this.setState({ bidder: p })}>{p}</Button>))
                    }
                </Button.Group>
            </Grid.Column>
        </Grid>
    }

    /**
     * What contract was selected? or show the selected contract
     */
    contract() {
        if (this.state.bidder) {
            return <Grid columns={12} stackable>
                <Grid.Column width={4}><strong>Contrat</strong></Grid.Column>
                <Grid.Column width={8}>
                    <Button.Group compact>
                        {
                            CONTRACTS.map(({val, lab}, idx) => (<Button key={idx} basic={val !== this.state.contract} primary onClick={() => this.setState({ contract: val })}>{lab}</Button>))
                        }
                    </Button.Group>
                </Grid.Column>
            </Grid>
        }
        return <div></div>
    }

    suitCalled() {
        if (this.state.players.length === 5) {
            if (!this.state.contract) {
                return <div></div>;
            }
            const suits = Object.keys(SUITS);
            return <Grid columns={12} stackable>
                <Grid.Column width={4}><strong>Couleur appelee</strong></Grid.Column>
                <Grid.Column width={8}>
                    <Button.Group compact>
                        {
                            suits.map((suitValue, idx) => (<Button key={idx} basic={suitValue !== this.state.suitCalled} primary onClick={() => this.setState({ suitCalled: suitValue })}>{SUITS[suitValue].lab} ({SUITS[suitValue].code})</Button>))
                        }
                    </Button.Group>
                </Grid.Column>
            </Grid>
        }
    }

    withChien() {
        return this.state.contract &&
            (this.state.contract !== 'GS' && this.state.contract !== 'GC');
    }

    /**
     * How good is the "chien"?
     */
    leDog() {
        // Ask only if not playing, it's shown and the suit has been called if applicable
        if (!this.state.playing && this.withChien() && 
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
        if (this.state.contract && (this.state.chien || !this.withChien()) &&
            (this.state.players.length !== 5 || this.state.suitCalled)) {
            return <div className="push-32">
                <Header>Des annonces?</Header>
                <Grid columns={2}>
                    <Grid.Column>
                        <div className="ui toggle checkbox">
                            <input type="checkbox" checked={this.state.grandChelem ? 'true' : ''} onChange={() => this.setState({ grandChelem: !this.state.grandChelem })} />
                            <label>Grand Chelem</label>
                        </div>
                    </Grid.Column>
                    <Grid.Column>
                        <div className="ui toggle checkbox">
                            <input type="checkbox" checked={this.state.poignee ? 'true': ''} onChange={() => this.setState({ poignee: !this.state.poignee })} />
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
        return <div className="push-32">
            <Grid columns={2}>
                <Grid.Column>
                    <div className="ui toggle checkbox">
                        <input type="checkbox" checked={this.state.petitAuBout ? 'true': ''} onChange={() => this.setState({petitAuBout: !this.state.petitAuBout})} />
                        <label>Petit au bout</label>
                    </div>
                </Grid.Column>
            </Grid>
        </div>
    }

    /**
     * Who is called?
     */
    sidekick() {
        if (this.state.players.length === 5) {
            return <div className="push-32">
                <Header>Qui a été appelé?</Header>
                <Button.Group compact>
                    {
                        this.state.players.map((p, idx) => (<Button key={idx} basic={p !== this.state.sidekick} positive onClick={() => this.setState({ sidekick: p })}>{p}</Button>))
                    }
                </Button.Group>
            </div>
        }
    }

    result() {
        if (this.state.players.length !== 5 || this.state.sidekick) {
            const { contract, petit, twentyOne, excuse, grandChelem } = this.state;
            var points = this.state.points;
            let oudlers = 0;
            if (petit) oudlers++;
            if (excuse) oudlers++;
            if (twentyOne) oudlers++;
            let base = basePoints(contract, points, oudlers, grandChelem);
            if (typeof points !== 'number') {
                points = pointsNeeded(2);
            }

            return <div className="push-32">
                <Header>Les bouts en attaque ({oudlers})</Header>
                <div>
                    <Button.Group>
                        <Button basic={!twentyOne} positive onClick={() => this.setState({ twentyOne: !twentyOne })}>21</Button>
                        <Button basic={!excuse} positive onClick={() => this.setState({ excuse: !excuse })}>Excuse</Button>
                        <Button basic={!petit} positive onClick={() => this.setState({ petit: !petit })}>Petit</Button>
                    </Button.Group>
                </div>
                {this.specialCase()}
                <RoundResult onResult={(attackPoints) => this.setState({ points: attackPoints })} points={points} />
                {!!base && 
                    <div className="push-32">
                        <span className={`ui label ${base > 0 ? 'green' : 'red'}`}>Points de base: {base}</span>
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

    cancel() {
        this.props.onRoundFinish()        
    }

    summary() {
        const contract = CONTRACTS.find(({val}) => val === this.state.contract).lab;
        return <div className="push-16">
        {this.state.bidder} a pris une {contract}
        {this.state.suitCalled && <span> et a appele {SUITS[this.state.suitCalled].lab}</span>}.
        {this.state.grandChelem && <strong> Grand chelem annonce!</strong> }
        </div>
    }

    play() {
        this.setState({playing: true})
    }

    render() {
        if (!this.state.players) {
            return <Container>
                <Header>Nouvelle Partie</Header>
                { this.skipper() }
            </Container>
        }
        return (<Container>
            <ReactCSSTransitionGroup
                transitionName="screen"
                transitionEnterTimeout={250}
                transitionLeaveTimeout={250}
            >
                {!this.state.playing &&
                    <div>
                    <Header>Nouvelle Partie</Header>
                    {this.bidder()}
                    {this.contract()}
                    {this.suitCalled()}
                    {this.leDog()}
                    {this.annonces()}
                    { this.state.bidder &&
                        (this.state.players.length !== 5 || this.state.suitCalled) &&
                        (this.state.chien || !this.withChien()) &&
                        <Container className="push-32" textAlign="center"><Button primary basic size="big" onClick={() => this.setState({ playing: true })}>Jouer!</Button></Container>
                    }
                    </div>
                }
                {this.state.playing &&
                    <div className="round-result">
                        <Header>Partie en cours</Header>
                        {this.summary()}
                        {this.sidekick()}
                        {this.result()}
                        <div className="round-footer">
                            <Grid columns={2} textAlign="center">
                                <Grid.Column>
                                    <Button basic onClick={() => this.cancel()}>Annuler la Partie</Button>
                                </Grid.Column>
                                <Grid.Column>
                                    <Button primary disabled={this.props.saving || typeof this.state.points === 'undefined'} loading={this.props.saving} basic onClick={() => this.finish()}>Valider</Button>
                                </Grid.Column>
                            </Grid>
                        </div>
                    </div>
                }
            </ReactCSSTransitionGroup>
        </Container>);
    }
}

export default Round;