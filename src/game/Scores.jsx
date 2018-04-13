import * as React from 'react'
import { Table, Button, Header } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import './Scores.scss'

class Scores extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        return <div className="scores">
            {/* <Header as="h4">{this.props.current.date.toLocaleDateString()}</Header> */}
            <Table definition unstackable>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell />
                        {
                            this.props.players.map(p => (
                                <Table.HeaderCell key={p}>{p}</Table.HeaderCell>

                            ))
                        }
                        <Table.HeaderCell>Contrat</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    <Table.Row>
                        <Table.Cell>1</Table.Cell>
                        {
                            this.props.players.map((p, idx) => 
                                (<Table.Cell key={idx}>+20</Table.Cell>)
                            )
                        }
                        <Table.Cell>G (+20)</Table.Cell>
                    </Table.Row>
                    {
                        this.props.current.rounds.map((round, idx) => (
                            <Table.Row key={idx}>
                                <Table.Cell>{idx + 1}</Table.Cell>
                                {
                                    round.map((pR, idx) => {
                                        <Table.Cell key={idx}>{pR}</Table.Cell>
                                    })
                                }
                                <Table.Cell>{round.contract}</Table.Cell>
                            </Table.Row>
                        ))
                    }
                </Table.Body>
            </Table>
            <Button circular size="massive" color='google plus' icon='plus' className="newGame" onClick={() => this.props.history.push(`/${this.props.id}/new`)}/>
        </div>
    }
}

export default withRouter(Scores);