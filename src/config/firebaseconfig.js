import * as firebase from 'firebase';

const config = {
    apiKey: "AIzaSyDbhpq-Ffm5AtCjrfNluxQ9p1Tyv915RJ8",
    authDomain: "derma-cupid.firebaseapp.com",
    databaseURL: "https://derma-cupid.firebaseio.com",
    projectId: "derma-cupid",
    storageBucket: "derma-cupid.appspot.com",
    messagingSenderId: "580886115652",
    appId: "1:580886115652:web:23b2241d1c168f92"
};

const Firebase = firebase.initializeApp(config);

export default Firebase;