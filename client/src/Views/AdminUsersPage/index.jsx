import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase'
import { actionTypes } from "redux-firestore";
import CssBaseline from "@material-ui/core/es/CssBaseline/CssBaseline";
import { withStyles } from "@material-ui/core";
import { styles } from "./styles";
import NewUser from "../../Components/AdminNewUser";
import UsersList from "../../Components/AdminUsersList";
import Grid from "@material-ui/core/Grid";

// STATELESS
const AdminUsersPage = (props) => {
  return (
    <>
      <CssBaseline/>
        <Grid
            container
            direction="row"
            justify="center"
            alignItems="flex-start"
            spacing={2}
        >
            <Grid item xs={2}>
                <NewUser/>
            </Grid>
            <Grid item xs={10}>
                <UsersList/>
            </Grid>
        </Grid>
    </>
  );
};

const mapStateToProps = state => {
  return {

  }
};

const mapDispatchToProps = dispatch => {
  return {

  }
};

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect(),
)(AdminUsersPage)