import * as React from 'react'

class Needed extends React.PureComponent {

    needed(player, totals) {
        let currentPoints = totals[player];
        // Next level
    }

    render() {
        let { players, current } = props.current;
        let totals = current.totals;

        return <div>
            {
                players.map((p, idx) => this.neededFor(p, totals))
            }
        </div>

    }
}