import React from 'react';
import { connect } from 'react-redux'
import { compose } from 'redux'
import {firestoreConnect, isLoaded, isEmpty} from 'react-redux-firebase'
import Loader from "../../Components/Loader";
import {Redirect} from "react-router-dom";

// STATELESS
const NotFoundPage = ({auth, profile, match}) => {
  if (!isLoaded(auth) || !isLoaded(profile)) {
    return <Loader/>
  }

  if (isEmpty(auth)) {
    return <Redirect exact to={'/login'}/>
  } else {
    return <Redirect exact to={'/trade'}/>
  }


};

const mapStateToProps = state => {
  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile
  }
};

export default compose(
    connect(mapStateToProps),
    firestoreConnect(),
)(NotFoundPage)