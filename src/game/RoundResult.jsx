import * as React from 'react'
import { Input, Button } from 'semantic-ui-react'

class RoundResult extends React.Component {

    constructor(props) {
        super(props);
        this.state = { attack: 46, defense: 45 }
        this.addAttack = this.addAttack.bind(this)
    }

    addAttack(pts) {
        let attack = Math.min(Math.max(0, this.state.attack + pts), 91);
        this.setState({attack, defense: 91 - attack});
    }

    render() {
        return (
            <div>
                Points en attaque:
                <div>
                    <Input labelPosition='right' type='number' placeholder='Points' value={this.state.attack}>
                        <Button basic onClick={() => this.addAttack(-1)}>-</Button>
                        <input />
                        <Button basic onClick={() => this.addAttack(1)}>+</Button>
                    </Input>
                </div>
                Points en defense:
                <div>
                    <Input labelPosition='right' type='number' placeholder='Points' value={this.state.defense}>
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