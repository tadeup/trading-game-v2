import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firestoreConnect, firebaseConnect } from 'react-redux-firebase'
import { actionTypes } from "redux-firestore";
import CssBaseline from "@material-ui/core/es/CssBaseline/CssBaseline";
import {TextField, withStyles} from "@material-ui/core";
import Button from "@material-ui/core/Button";

export const styles = theme => ({

});

// STATEFUL
class NewUser extends Component {
  state = {
    email: '',
    pw: ''
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleSubmit = (event) => {
    this.props.firebase.createUser({
      email: this.state.email,
      password: this.state.pw
    }, {
      email: this.state.email,
      isAdmin: false,
    }).then(()=>{
      this.setState({
        email: '',
        pw: ''
      })
    });
  };

  render() {
    const { classes } = this.props;
    const { email, pw } = this.state;
    return (
      <>
        <CssBaseline/>
        <TextField
            label="email"
            className={classes.textField}
            value={email}
            onChange={this.handleChange('email')}
            margin="normal"
        />
        <TextField
            label="senha"
            className={classes.textField}
            value={pw}
            onChange={this.handleChange('pw')}
            margin="normal"
        />
        <Button variant="contained" className={classes.button} onClick={this.handleSubmit}>
          Enviar
        </Button>
      </>
    );
  }
}

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
)(NewUser)