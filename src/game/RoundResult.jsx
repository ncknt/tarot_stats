import * as React from 'react'
import { Input, Button } from 'semantic-ui-react'

class RoundResult extends React.PureComponent {

    constructor(props) {
        super(props);
        this.addAttack = this.addAttack.bind(this)
        this.handleAttack = this.handleAttack.bind(this)
        this.handleDefense = this.handleDefense.bind(this)
    }

    addAttack(pts) {
        let points = Math.min(Math.max(0, this.props.points + pts), 91);
        this.props.onResult(points);
    }

    handleAttack(event) {
        let val = Math.min(Math.max(0, parseInt(event.target.value, 10)), 91);
        this.props.onResult(val);
    }

    handleDefense(event) {
        let val = Math.min(Math.max(0, parseInt(event.target.value, 10)), 91);
        this.props.onResult(91 - (val || 0));
    }

    render() {
        const attack = isNaN(this.props.points) ? '' : this.props.points;
        return (
            <div className="push-32">
                Points en attaque:
                <div>
                    <Input labelPosition='right' type='number' placeholder='Points'>
                        <Button basic onClick={() => this.addAttack(-1)}>-</Button>
                        <input onChange={this.handleAttack} value={attack} min={0} max={91}/>
                        <Button basic onClick={() => this.addAttack(1)}>+</Button>
                    </Input>
                </div>
                Points en defense:
                <div>
                    <Input labelPosition='right' type='number' placeholder='Points'>
                        <Button basic onClick={() => this.addAttack(1)}>-</Button>
                        <input onChange={this.handleDefense} value={91 - (this.props.points || 0)} min={0} max={91} />
                        <Button basic onClick={() => this.addAttack(-1)}>+</Button>
                    </Input>
                </div>
            </div>
        )
    }

}

export default RoundResult