// FOR MORE INFO ON CONFIG VISIT: https://firebase.google.com/docs/web/setup

import { createFirestoreInstance } from 'redux-firestore'
// Adding firebase components
import firebase from "firebase/app";
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
// Local imports
import {store} from "../Redux/configureStore";

// Declaring the config obj
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_MESSAGING_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize app with config
firebase.initializeApp(firebaseConfig);

// Config the firebase enhancer for the redux store
const rrfConfig = {
  userProfile: 'users',  // firebase root where user profiles are stored
  attachAuthIsReady: true, // attaches auth is ready promise to store
  useFirestoreForProfile: true,
  enableLogging: true,
};


export const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance,
};
