import * as React from 'react'
import { Grid, Container } from 'semantic-ui-react'
import './StatsPlayerHeader.scss'

class StatsPlayerHeader extends React.PureComponent {

    render() {
        return <Container className="stats-header">
            <Grid>
            {
                this.props.cPlayers.map(({player, color}, idx) => {
                    return <Grid.Column key={idx} mobile={4} tablet={3} computer={2}>
                        <span className="stats-player" style={{backgroundColor: color}}></span>
                        {player}
                    </Grid.Column>
                })
            }
            </Grid>
        </Container>
    }
}

export default StatsPlayerHeader