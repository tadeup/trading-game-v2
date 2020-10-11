import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux'
import {compose} from 'redux'
import {firestoreConnect, firebaseConnect} from 'react-redux-firebase'
import {actionTypes} from "redux-firestore";
import CssBaseline from "@material-ui/core/es/CssBaseline/CssBaseline";
import {Grid, Paper, Snackbar, TextField, Typography, withStyles} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import MySnackbarContentWrapper from "../CustomizedSnackbars";

export const styles = theme => ({
  paper: {
    padding: 12
  }
});

// STATEFUL
class SelfSettings extends Component {
  state = {
    isSending: false,
    snackbarOpen: false,
    snackbarVariant: 'info',
    snackbarMessage: ''
  };

  handleChange = name => event => {
    this.setState({[name]: event.target.value});
  };

  handleSubmit = (event) => {
    this.setState({isSending: true})
    this.props.firebase.auth().languageCode = 'pt-br'
    this.props.firebase.auth().sendPasswordResetEmail('tadeup1@gmail.com').then(res => {
      this.setState({isSending: false, snackbarOpen: true, snackbarVariant: 'success', snackbarMessage: 'Enviado com sucesso! Favor checar seu e-mail'})
    }).catch(e => {
      this.setState({isSending: false, snackbarOpen: true, snackbarVariant: 'error', snackbarMessage: 'Ops! Algo Deu Errado, Tente Novamente'})
    });
  };

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({snackbarOpen: false});
  };

  render() {
    const { classes, assetsList } = this.props;
    const { isSending, snackbarOpen, snackbarMessage, snackbarVariant } = this.state;
    return (
      <>
        <CssBaseline/>
        <Button fullWidth variant="contained" className={classes.button} onClick={this.handleSubmit} disabled={isSending}>
          Enviar e-mail de reset da senha
        </Button>

        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          autoHideDuration={2000}
          onClose={this.handleClose}
          open={snackbarOpen}
        >
          <MySnackbarContentWrapper
            onClose={this.handleClose}
            variant={snackbarVariant}
            message={snackbarMessage}
          />
        </Snackbar>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    assetsList: state.firestore.ordered.assetsList || []
  }
};

const mapDispatchToProps = dispatch => {
  return {}
};

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect(),
)(SelfSettings)