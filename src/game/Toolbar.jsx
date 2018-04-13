import * as React from 'react'
import { Segment, Grid, Button } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import './Toolbar.scss'

class Toolbar extends React.PureComponent {
    render() {
        const id = this.props.id;

        return <Segment className="toolbar">
            <Grid columns={3} centered>
                <Grid.Column>
                    <Button className={this.props.active === 'scores' ? 'active' : null} onClick={() => this.props.history.push(`/${id}/scores`)}>Scores</Button>
                </Grid.Column>
                <Grid.Column>
                    <Button className={this.props.active === 'stats' ? 'active' : null} onClick={() => this.props.history.push(`/${id}/stats`)}>Stats</Button>
                </Grid.Column>
                <Grid.Column>
                    <Button className={this.props.active === 'saison' ? 'active' : null} onClick={() => this.props.history.push(`/${id}/saison`)}>Saison</Button>
                </Grid.Column>
            </Grid>
        </Segment>
    }
}

export default withRouter(Toolbar);