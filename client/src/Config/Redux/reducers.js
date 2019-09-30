import { combineReducers } from 'redux';
import { firebaseReducer } from 'react-redux-firebase'
import { firestoreReducer } from 'redux-firestore'

import {initialState as stockListInitial, reducer as stockListReducer} from "../../Components/StocksList/redux/reducers";

export const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,

  stockList: stockListReducer,
});

export const initialState = {
  stockList: stockListInitial,
};