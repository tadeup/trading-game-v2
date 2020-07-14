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
class NewUser extends Component {
    state = {
        email: '',
        name: '',
        pw: '',
        isSending: false,
        snackbarOpen: false,
        snackbarVariant: 'info',
        snackbarMessage: ''
    };

    handleChange = name => event => {
        this.setState({[name]: event.target.value});
    };

    handleSubmit = (event) => {
        if (this.state.email && this.state.pw && this.state.name) {

            const positions = Object.assign(
                {},
                ...this.props.assetsList.map(asset=>({
                    [asset.assetName]: {openBuy: 0, openSell: 0, closed: 0, avgBuyPrice: 0, avgSellPrice: 0, buyQuantity: 0, sellQuantity: 0}
                }))
            );

            this.setState({ isSending: true }, () => {
                const newUser = this.props.firebase.functions().httpsCallable('newUser');
                newUser({
                    email: this.state.email,
                    name: this.state.name,
                    password: this.state.pw,
                    isAdmin: false,
                    positions: positions
                }).then((res)=>{
                    console.log(res);
                    if (res.data && res.data.success) {
                        this.setState({
                            email: '',
                            name: '',
                            pw: '',
                            isSending: false,
                            snackbarOpen: true, snackbarVariant: 'success', snackbarMessage: 'Ativo Enviada com Sucesso!'
                        })
                    } else if (res.data && res.data.error && res.data.error.errorInfo && res.data.error.errorInfo.message) {
                        this.setState({
                            isSending: false,
                            snackbarOpen: true, snackbarVariant: 'error', snackbarMessage: res.data.error.errorInfo.message
                        })
                    } else {
                        this.setState({
                            isSending: false,
                            snackbarOpen: true, snackbarVariant: 'error', snackbarMessage: 'Ops! Algo Deu Errado, Tente Novamente'
                        })
                    }
                })
            });
        } else {
            this.setState({ snackbarOpen: true, snackbarVariant: 'warning', snackbarMessage: 'Favor preencher todos os dados' })
        }
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
            <Paper className={classes.paper}>
                <CssBaseline/>
                <Grid
                    container
                    direction="column"
                    justify="flex-start"
                    alignItems="center"
                >
                    <Typography variant="h5">Novo Usuário</Typography>
                    <TextField
                        label="email"
                        className={classes.textField}
                        value={email}
                        onChange={this.handleChange('email')}
                        margin="normal"
                        variant="outlined"
                        fullWidth={true}
                    />
                    <TextField
                        label="Nome"
                        className={classes.textField}
                        value={name}
                        onChange={this.handleChange('name')}
                        margin="normal"
                        variant="outlined"
                        fullWidth={true}
                    />
                    <TextField
                        label="senha"
                        className={classes.textField}
                        value={pw}
                        onChange={this.handleChange('pw')}
                        margin="normal"
                        variant="outlined"
                        fullWidth={true}
                    />
                    <Button variant="contained" className={classes.button} onClick={this.handleSubmit} disabled={isSending}>
                        Enviar
                    </Button>
                </Grid>

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
)(NewUser)