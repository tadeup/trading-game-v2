import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firestoreConnect, firebaseConnect } from 'react-redux-firebase'
import { actionTypes } from "redux-firestore";
import CssBaseline from "@material-ui/core/es/CssBaseline/CssBaseline";
import { withStyles } from "@material-ui/core";
import { styles } from "./styles";

// STATEFUL
class _TEMPLATE extends Component {
  state = {  };

  render() {
    return (
      <>
        <CssBaseline/>
      </>
    );
  }
}

// STATELESS
const _TEMPLATE = (props) => {
  return (
    <>
      <CssBaseline/>
    </>
  );
};

_TEMPLATE.propTypes = {
  // Optional props
  auth: PropTypes.object.isRequired,
  clearFirestore: PropTypes.func.isRequired,

  // Required Functions
  dispatch: PropTypes.func.isRequired,
  // Required Objects
  classes: PropTypes.object.isRequired,
  firebase: PropTypes.object.isRequired,
  firestore: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {

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
  firestoreConnect(),
)(_TEMPLATE)