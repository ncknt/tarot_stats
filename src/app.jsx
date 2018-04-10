import * as React from "react"
import 'semantic-ui/dist/semantic.min.css'
import './App.scss'
import Upload from './upload/Upload'
import Splash from './splash/Splash'

export default class App extends React.Component {
    render() {
        return <div>
            <Splash />
        </div>;
    }
}