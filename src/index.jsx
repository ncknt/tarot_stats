import * as React from "react"
import * as ReactDOM from "react-dom"
import App from './app'
import firebase from 'firebase'
import 'firebase/firestore'

__webpack_public_path__ = "http://localhost:8080/"

firebase.initializeApp(TAROT_CONFIG.firebase);

firebase.firestore().enablePersistence().then(() => {
    const root = document.getElementById('app');
    ReactDOM.render(<App pathname={location.pathname} user={firebase.auth().currentUser} />, root);
})


