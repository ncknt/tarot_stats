import * as React from 'react'
import { Segment, Grid, Button } from 'semantic-ui-react'
import './Toolbar.scss'

class Toolbar extends React.PureComponent {
    render() {
        return <Segment className="toolbar">
            <Grid columns={3}>
                <Grid.Column>
                    <Button className={this.props.active === 'scores' ? 'active' : null} name="scores" onClick={() => this.props.onRouteChange}>Scores</Button>
                </Grid.Column>
                <Grid.Column>
                    <Button className={this.props.active === 'stats' ? 'active' : null} name="stats" onClick={this.props.onRouteChange}>Stats</Button>
                </Grid.Column>
                <Grid.Column>
                    <Button className={this.props.active === 'saison' ? 'active' : null} name="saison" onClick={this.props.onRouteChange}>Saison</Button>
                </Grid.Column>
            </Grid>
        </Segment>
    }
}

export default Toolbar;