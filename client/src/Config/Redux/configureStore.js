import { createStore, compose } from "redux";

import { initialState, rootReducer } from './reducers'

//future enhancers middlewares will go here
const enhancers = [

];

//OPTIONAL configuration of dev-tools
const reduxDevToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
if (
  process.env.NODE_ENV === "development" &&
  typeof reduxDevToolsExtension === "function"
) {
  enhancers.push(reduxDevToolsExtension())
}

const composedEnhancers = compose(
  ...enhancers
);

export const store = createStore(rootReducer, initialState, composedEnhancers);