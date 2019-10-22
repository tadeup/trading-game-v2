import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firestoreConnect, firebaseConnect } from 'react-redux-firebase'
import { actionTypes } from "redux-firestore";
import CssBaseline from "@material-ui/core/es/CssBaseline/CssBaseline";
import {Paper, Snackbar, TextField, withStyles} from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import MySnackbarContentWrapper from "../CustomizedSnackbars";

export const styles = theme => ({
    textField: {

    }
});

// STATEFUL
class NewAsset extends Component {
    state = {
        name: '',
        margin: 100,
        isContinuous: false,
        isSending: false,
        snackbarOpen: false,
        snackbarVariant: 'info',
        snackbarMessage: ''
    };

    handleChange = name => event => {
        this.setState({ [name]: event.target.value });
    };

    handleChangeInt = name => event => {
        if (event.target.value) {
            this.setState({ [name]: parseInt(event.target.value) });
        } else {
            this.setState({ [name]: 0 });
        }
    };

    handleCheck = name => event => {
        this.setState({ [name]: event.target.checked });
    };

    handleSubmit = event => {
        if (this.state.name && this.state.margin) {
            this.setState({ isSending: true }, () => {
                const newAsset = this.props.firebase.functions().httpsCallable('newAsset');
                newAsset({
                    assetName: this.state.name,
                    assetMargin: this.state.margin,
                    assetIsContinuous: this.state.isContinuous,
                    assetIsActive: true,
                }).then((res)=>{
                    console.log(res);
                    if (res.data && res.data.success) {
                        this.setState({ name: '', margin: 100, isContinuous: false, isSending: false, snackbarOpen: true, snackbarVariant: 'success', snackbarMessage: 'Oferta Enviada com Sucesso!' })
                    } else {
                        this.setState({ name: '', margin: 100, isContinuous: false, isSending: false, snackbarOpen: true, snackbarVariant: 'error', snackbarMessage: 'Ops! Algo Deu Errado, Tente Novamente' })
                    }
                })
            });
        } else {
            this.setState({ snackbarOpen: true, snackbarVariant: 'warning', snackbarMessage: 'Nome e Margem Precisam Ser Diferente de Nulo' })
        }
    };

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({snackbarOpen: false});
    };

    render() {
        const { classes }= this.props;
        const { name, margin, isContinuous, isSending, snackbarMessage, snackbarOpen, snackbarVariant } = this.state;
        return (
            <Paper>
                <CssBaseline/>
                <TextField
                    label="Nome do Ativo"
                    className={classes.textField}
                    value={name}
                    onChange={this.handleChange('name')}
                    margin="normal"
                    variant="outlined"
                />
                <TextField
                    label="Margem"
                    className={classes.textField}
                    value={margin}
                    onChange={this.handleChangeInt('margin')}
                    margin="normal"
                    variant="outlined"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={isContinuous}
                            onChange={this.handleCheck('isContinuous')}
                            value="checkedA"
                        />
                    }
                    label="Trade Continuo"
                />
                <Button variant="contained" className={classes.button} onClick={this.handleSubmit} disabled={isSending}>
                    Adicionar
                </Button>

                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    autoHideDuration={4000}
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
)(NewAsset)