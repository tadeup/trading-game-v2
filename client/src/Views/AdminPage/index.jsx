import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { compose } from 'redux'
import {firestoreConnect, isLoaded, isEmpty} from 'react-redux-firebase'
import { actionTypes } from "redux-firestore";
import CssBaseline from "@material-ui/core/es/CssBaseline/CssBaseline";
import {Container, withStyles} from "@material-ui/core";
import { styles } from "./styles";
import Loader from "../../Components/Loader";
import {Redirect, Switch, Route} from "react-router-dom";
import adminRoutes from "../../Config/Router/adminRoutes";
import Navbar from "../../Components/Navbar";
import NotFoundPage from "../NotFoundPage";

// STATELESS
const AdminPage = ({auth, profile, classes, match}) => {
  if (!isLoaded(auth)) {
    return <Loader/>
  }

  if (isEmpty(auth)) {
    return <Redirect exact to={'/login'}/>
  }

  if (!profile.isAdmin) {
    return <Redirect exact to={'/trade'}/>
  }

  return (
    <>
      <CssBaseline/>
      <Navbar/>
      <Container maxWidth={'xl'} className={classes.container}>
        <Switch>
          { adminRoutes.map((prop, key) => {return <Route exact path={`${match.path}${prop.path}`} key={key} component={prop.component}/>}) }
          <Route component={NotFoundPage} />
        </Switch>
      </Container>
    </>
  );
};

const mapStateToProps = state => {
  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile
  }
};

const mapDispatchToProps = dispatch => {
  return {
    clearFirestore: () => dispatch({ type: actionTypes.CLEAR_DATA })
  }
};

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect((props) => {
    return [
      {
        collection: 'assets',
        storeAs: 'assetsList'
      },
      {
        collection: 'users',
        storeAs: 'usersList'
      },
    ]
  }),
)(AdminPage)