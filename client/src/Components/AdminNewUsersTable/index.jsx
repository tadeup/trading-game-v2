import React, {Component} from 'react';
import {connect} from 'react-redux'
import {compose} from 'redux'
import {firestoreConnect, firebaseConnect} from 'react-redux-firebase'
import {actionTypes} from "redux-firestore";
import CssBaseline from "@material-ui/core/es/CssBaseline/CssBaseline";
import {Grid, Paper, Snackbar, TextField, Typography, withStyles} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import MySnackbarContentWrapper from "../CustomizedSnackbars";
import ReactDataSheet from "react-datasheet";
import 'react-datasheet/lib/react-datasheet.css';
import './index.css'

export const styles = theme => ({
  paper: {
    padding: 12
  },
  usersTable: {
    width: "100%"
  }
});

const initialGrid = [
  [
    { value: 'status', readOnly: true },
    { value: 'e-mail', readOnly: true },
    { value: 'Nome', readOnly: true },
    { value: 'Senha', readOnly: true },
  ],
    ...[1,2,3,4,5,6,7,8,9,10,
      11,12,13,14,15,16,17,18,19,20,
      21,22,23,24,25,26,27,28,29,30,
      31,32,33,34,35,36,37,38,39,40,
      41,42,43,44,45,46,47,48,49,50].map(el=> ([
      { readOnly: true, value: '' },
      { value: '' },
      { value: '' },
      { value: '' },
    ])),
]

// STATEFUL
class NewUsersTable extends Component {
  state = {
    grid: initialGrid,
    // email: '',
    // name: '',
    // pw: '',
    isSending: false,
    snackbarOpen: false,
    snackbarVariant: 'info',
    snackbarMessage: ''
  };

  handleChange = name => event => {
    this.setState({[name]: event.target.value});
  };

  handleSubmit = (event) => {
    this.setState({ isSending: true }, () => {
      const newUser = this.props.firebase.functions().httpsCallable('newUser');
      const newGridPromises = this.state.grid.map((row, index) => {
        const rowEmail = row[1].value;
        const rowName = row[2].value;
        const rowPassword = row[3].value;

        if (index && rowEmail && rowName && rowPassword && !row[1].readOnly) {
          const positions = Object.assign(
            {},
            ...this.props.assetsList.map(asset=>({
              [asset.assetName]: {openBuy: 0, openSell: 0, closed: 0, avgBuyPrice: 0, avgSellPrice: 0, buyQuantity: 0, sellQuantity: 0}
            }))
          );
          return newUser({email: rowEmail, name: rowName, password: rowPassword, isAdmin: false, positions: positions})
            .then((res)=>{
              console.log(res);
              if (res.data && res.data.success) {
                return [
                  { readOnly: true, value: 'Usuário salvo com sucesso!' },
                  { readOnly: true, value: rowEmail },
                  { readOnly: true, value: rowName },
                  { readOnly: true, value: rowPassword },
                ]
                // this.setState({
                //   email: '',
                //   name: '',
                //   pw: '',
                //   isSending: false,
                //   snackbarOpen: true, snackbarVariant: 'success', snackbarMessage: 'Ativo Enviada com Sucesso!'
                // })
              } else if (res.data && res.data.error && res.data.error.errorInfo && res.data.error.errorInfo.message) {
                return [
                  { readOnly: true, value: res.data.error.errorInfo.message },
                  { value: rowEmail },
                  { value: rowName },
                  { value: rowPassword },
                ]
                // this.setState({
                //   isSending: false,
                //   snackbarOpen: true, snackbarVariant: 'error', snackbarMessage: res.data.error.errorInfo.message
                // })
              } else {
                return [
                  { readOnly: true, value: 'Ops! Algo Deu Errado, Tente Novamente' },
                  { value: rowEmail },
                  { value: rowName },
                  { value: rowPassword },
                ]
                // this.setState({
                //   isSending: false,
                //   snackbarOpen: true, snackbarVariant: 'error', snackbarMessage: 'Ops! Algo Deu Errado, Tente Novamente'
                // })
              }
            });
        } else {
          return row
        }
      });
      Promise.all(newGridPromises).then(newGrid=>{
        this.setState({
          grid: newGrid,
          isSending: false
        })
      });
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
    const { email, name, pw, isSending, snackbarOpen, snackbarMessage, snackbarVariant } = this.state;
    return (
      <Paper>
        <Button
          onClick={this.handleSubmit}
          fullWidth
          variant={'contained'}
          style={{boxShadow: "none", borderRadius: 0}}
          disabled={isSending}
        >
          Salvar
        </Button>
        <ReactDataSheet
          className={classes.usersTable}
          data={this.state.grid}
          valueRenderer={cell => cell.value}
          onCellsChanged={changes => {
            const grid = this.state.grid.map(row => [...row]);
            changes.forEach(({ cell, row, col, value }) => {
              grid[row][col] = { ...grid[row][col], value };
            });
            this.setState({ grid });
          }}
        />
      </Paper>
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
)(NewUsersTable)