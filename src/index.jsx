import * as React from "react"
import * as ReactDOM from "react-dom"
import App from './app'

__webpack_public_path__ = "http://localhost:8080/"


const root = document.getElementById('app');
ReactDOM.render(<App pathname={location.pathname}/>, root);
