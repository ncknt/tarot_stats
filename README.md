Another tarot score counter.

[https://tarot-score.firebaseapp.com/|Demo]

# WIP
It's a work in progress. I contribute when I have time. It still needs a cleaner UI, stats, and predictions.

# Why?

There are a few score apps out there. I wanted one that:
- could easily be installed on iOS and Android devices. This is a PWA (progressive web app), you can add to your home screen without going through app stores.
- could share scores in real time for all players to see.
- would keep track of scores across multiple games.
- would be flexible enough to accommodate guest players and more than 5 players. That's not orthodox but that's how we play the game.
- would display more advanced statistics
- would predict success
- is fun to code.

# What are the rules?
Check [here](https://www.regles-de-jeux.com/regle-du-tarot/).

# Why in French?
Because this game is mostly played in France and Italy. Code is in English because that's what I'm used to when coding.

# Dependencies
The app is a PWA (or will be soon). It's using:
- React
- React router
- React Toastify for notifications
- Semantic UI as a UI framework. For now, the whole thing is included but it should be trimmed down.
- Firebase's Firestore for data storage and to serve static assets
- Babel/webpack for ES2015 and JSX transpiling.

# Development
For now, feel free to use the demo link. I'll use your data to check if other groups play better than we do! The app uses Firebase to store the data. It should be trivial to host the data in another NoSQL store (or RDBMS).

## Set up Firebase
[Open an account](https://firebase.google.com/) with Firebase, start a new project, and plug the various credentials/URLs in `./tarot-config.json` at the root of the project:

```json
{
    "firebase": {
        "apiKey": "xxxxxxx",
        "authDomain": "xxxxx.firebaseapp.com",
        "databaseURL": "https://xxxxx.firebaseio.com",
        "projectId": "xxxxxxx",
        "storageBucket": "xxxxx.appspot.com",
        "messagingSenderId": "xxxxxxx"
    }
}
```

## Install the dependencies
Install the Firebase CLI (globally or not):
```
npm install -g firebase-tools
```

Install the project's dependencies:
```
npm install
```

## Deployment
Build the app:

```
npm run build
```

This should build your assets under `public`.

You can then deploy your app to your own Firebase instance:
```
firebase deploy
```

## Development
The app is using webpack with hot reload, you can change that in `package.json`.
```
npm start
```

You'll also need to serve your assets through firebase locally:
```
firebase serve
```

Go to `http://localhost:8080`. Assets are served by webpack and other requests are forwarded to firebase (port 8888).