import * as React from 'react'
import { Input, Button } from 'semantic-ui-react'

class RoundResult extends React.PureComponent {

    constructor(props) {
        super(props);
        this.addAttack = this.addAttack.bind(this)
    }

    addAttack(pts) {
        let points = Math.min(Math.max(0, this.props.points + pts), 91);
        this.props.onResult(points);
    }

    render() {
        return (
            <div>
                Points en attaque:
                <div>
                    <Input labelPosition='right' type='number' placeholder='Points' value={this.props.points}>
                        <Button basic onClick={() => this.addAttack(-1)}>-</Button>
                        <input />
                        <Button basic onClick={() => this.addAttack(1)}>+</Button>
                    </Input>
                </div>
                Points en defense:
                <div>
                    <Input labelPosition='right' type='number' placeholder='Points' value={91 - this.props.points}>
                        <Button basic onClick={() => this.addAttack(1)}>-</Button>
                        <input />
                        <Button basic onClick={() => this.addAttack(-1)}>+</Button>
                    </Input>
                </div>
            </div>
        )
    }

}

export default RoundResult