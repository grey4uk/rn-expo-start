import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import "firebase/compat/storage";
import {REACT_APP_KEY_FIREBASE} from '../../.env';

// Your web app’s Firebase configuration
const firebaseConfig = {
  apiKey: REACT_APP_KEY_FIREBASE,
  authDomain: "grey4ukapp.firebaseapp.com",
  databaseURL: "https://grey4ukapp.firebaseio.com",
  projectId: "grey4ukapp",
  storageBucket: "grey4ukapp.appspot.com",
  messagingSenderId: "476601033519",
  appId: "1:476601033519:web:a315334ff07abdd5a237da",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const firestore = firebase.firestore();
const storage = firebase.storage();

export { auth, firestore, storage };
