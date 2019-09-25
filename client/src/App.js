import React from 'react';

import { Provider } from 'react-redux'
import {BrowserRouter, Route, Switch} from "react-router-dom";
import { ReactReduxFirebaseProvider } from 'react-redux-firebase'

import { store } from "./Config/Redux/configureStore";
import { rrfProps } from "./Config/Firebase";
import indexRoutes from "./Config/Router";

const App = () => (
    <Provider store={store}>
        <ReactReduxFirebaseProvider {...rrfProps}>
            <BrowserRouter>
                <Switch>
                    { indexRoutes.map((prop, key) => {return <Route path={prop.path} key={key} component={prop.component}/>}) }
                </Switch>
            </BrowserRouter>
        </ReactReduxFirebaseProvider>
    </Provider>
);

export default App;
