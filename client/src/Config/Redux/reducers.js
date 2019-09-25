import { combineReducers } from 'redux';
import { firebaseReducer } from 'react-redux-firebase'
import { firestoreReducer } from 'redux-firestore'

// import {initialState as somePageInitial, reducer as somePageReducer} from "../views/---/redux/reducers";

export const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,

  // somePage: somePageReducer,
});

export const initialState = {
  // somePage: somePageInitial,
};