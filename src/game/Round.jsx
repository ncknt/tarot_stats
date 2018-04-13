import * as React from 'react'
import update from 'react-addons-update';
import { Header, Dropdown, Button, Grid, Rating, Container } from 'semantic-ui-react'
import { CONTRACTS, CHIENS, SUITS } from '../utils/constants'
import RoundResult from './RoundResult'

import './Round.scss'

class Round extends React.Component {

    constructor(props) {
        super(props)
        this.state = { playing: false, skip: [] };
        this.skipper = this.skipper.bind(this);
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
        if (this.state.players) {
            if (this.state.bidder) {
                return <Grid columns={2} className="no-space">
                    <Grid.Column><strong>{this.state.bidder}</strong> a pris.</Grid.Column>
                    <Grid.Column textAlign="right">
                        <Button icon="undo" basic onClick={() => this.setState({bidder: null})}/>
                    </Grid.Column>
                </Grid>
            }
            const onTap = (player) => this.setState({ bidder: player })
            return <div>
                <Header>Qui a pris?</Header>
                <Grid columns={4} stackable>
                    {this.state.players.map((player, index) => (<Grid.Column key={index}><Button basic color="purple" onClick={() => onTap(player)}>{player}</Button></Grid.Column>))}
                </Grid>
            </div>
        }
    }

    /**
     * What contract was selected? or show the selected contract
     */
    contract() {
        if (this.state.bidder) {
            if (this.state.contract) {
                let lab = CONTRACTS.find(({val}) => val === this.state.contract).lab;
                return <Grid columns={2} className="no-space">
                    <Grid.Column>Le contrat est une <b>{lab}.</b></Grid.Column>
                    <Grid.Column textAlign="right">
                        <Button icon="undo" basic onClick={() => this.setState({ contract: null })} />
                    </Grid.Column>
                </Grid>
            }

            const onTap = (contract) => this.setState({contract: contract});
            return <div>
                <Header>Que prend {this.state.bidder}?</Header>
                <Grid columns={4} stackable>
                {
                    CONTRACTS.map(({ lab, val }, index) => (<Grid.Column key={index}><Button basic color="purple" onClick={() => onTap(val)}>{lab}</Button></Grid.Column>))
                }
                </Grid>
            </div>
        }
    }

    /**
     * How good is the "chien"?
     */
    leDog() {
        if (this.state.contract && (this.state.players.length !== 5 || this.state.suitCalled)) {
            if (this.state.chien) {
                return <Grid columns={2} className="no-space">
                    <Grid.Column>
                        Le chien: <Rating disabled defaultRating={this.state.chien} maxRating={5} />
                    </Grid.Column>
                    <Grid.Column textAlign="right">
                        <Button icon="undo" basic onClick={() => this.setState({ chien: null })} />
                    </Grid.Column>
                </Grid>
            }
            const onRate = (e, { rating, maxRating }) => this.setState({ chien: rating });
            return <div>
                <Header>Comment est le chien?</Header>
                <Rating maxRating={5} onRate={onRate} />
            </div>
        }
    }

    suitCalled() {
        if (this.state.contract && this.state.players.length === 5) {
            const suitString = (suitCode) => suitCode.replace(/\\u(\w\w\w\w)/g, (a, b) => String.fromCharCode(parseInt(b, 16)));

            if (this.state.suitCalled) {
                let code = SUITS[this.state.suitCalled].code;
                return <Grid columns={2} className="no-space">
                    <Grid.Column>
                        {suitString(code)} appelé.
                    </Grid.Column>
                    <Grid.Column textAlign="right">
                        <Button icon="undo" basic onClick={() => this.setState({ suitCalled: null })} />
                    </Grid.Column>
                </Grid>
            }
            const onTap = (suit) => this.setState({ suitCalled: suit });
            const suits = Object.keys(SUITS);
            return <div>
                <Header>Quel roi est appelé?</Header>
                <Grid columns={4}>
                    <Grid.Column><Button size="big" basic color="black" onClick={() => onTap('P')}>{suitString(SUITS.P.code)}</Button></Grid.Column>
                    <Grid.Column><Button size="big" basic color="red" onClick={() => onTap('C')}>{suitString(SUITS.C.code)}</Button></Grid.Column>
                    <Grid.Column><Button size="big" basic color="red" onClick={() => onTap('R')}>{suitString(SUITS.R.code)}</Button></Grid.Column>
                    <Grid.Column><Button size="big" basic color="black" onClick={() => onTap('T')}>{suitString(SUITS.T.code)}</Button></Grid.Column>
                    {/* {
                        suits.map((suit, index) => (<Grid.Column key={index}><Button size="big" basic color="purple" onClick={() => onTap(suit)}>{suitString(SUITS[suit].code)}</Button></Grid.Column>))
                    } */}
                </Grid>
            </div>            

        }
    }

    /**
     * Who is called?
     */
    sidekick() {
        if (this.state.contract && this.state.players.length === 5 && this.state.chien) {
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
                <Header>Qui est appelé?</Header>
                <Grid columns={4} stackable>
                    {this.state.players.map((player, index) => (<Grid.Column key={index}><Button basic color="purple" onClick={() => onTap(player)}>{player}</Button></Grid.Column>))}
                </Grid>
            </div>
        }
    }

    summary() {
        let contract = CONTRACTS.find(({ val }) => val === this.state.contract).lab;
        let suit = SUITS[this.state.suitCalled];
        return <Header>
            {this.state.bidder} a pris une {contract}
            {this.state.suitCalled && 
            <span> et a appelé {suit.lab}</span>}.
        </Header>
    }

    result() {
        return <RoundResult />
    }

    render() {
        if (this.state.playing) {
            return <div>
                {this.summary()}
                {this.sidekick()}
                {this.result()}
            </div>
        }
        return <div>
            <Header>Nouvelle Partie</Header>
            <hr/>
            {this.skipper()}
            {this.bidder()}
            {this.contract()}
            {this.suitCalled()}
            {this.leDog()}
            {this.state.chien && this.state.bidder && this.state.contract && 
                <Container textAlign="center"><Button basic size="big" onClick={() => this.setState({playing: true})}>Jouer!</Button></Container>
            }
        </div>
    }
}

export default Round;