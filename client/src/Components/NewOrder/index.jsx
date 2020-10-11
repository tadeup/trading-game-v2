import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firestoreConnect, firebaseConnect } from 'react-redux-firebase'
import { actionTypes } from "redux-firestore";
import CssBaseline from "@material-ui/core/es/CssBaseline/CssBaseline";
import {Paper, Snackbar, Typography, withStyles} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import MySnackbarContentWrapper from "../CustomizedSnackbars";

export const styles = theme => ({
    textInput: {

    },
    paper: {
        padding: 16
    },
    tabs: {
        marginBottom: 16
    }
});

// STATEFUL
class NewOrder extends Component {
    state = {
        quantity: '',
        price: '',
        isBuy: 0,
        isSending: false,
        snackbarOpen: false,
        snackbarVariant: 'info',
        snackbarMessage: ''
    };

    handleChange = name => event => {
        this.setState({ [name]: event.target.value });
    };

    handleChangeInt = name => event => {
        const el = parseInt(event.target.value) > 0 ? parseInt(event.target.value) : '';
        if (event.target.value) {
            this.setState({ [name]: el });
        } else {
            this.setState({ [name]: '' });
        }
    };

    handleChangeFloat = name => event => {
        const x = Number(event.target.value.toString().split(".").map((el,i)=>i?el.split("").slice(0,2).join(""):el).join("."));
        if (x <= 0) {
            this.setState({ [name]:  ''});
        }
        else {
            this.setState({ [name]:  x});
        }
console.log(x)
        // if (event.target.value) {
        //     this.setState({ [name]: parseFloat(event.target.value) });
        // } else {
        //     this.setState({ [name]: '' });
        // }
    };

    handleTab = name => (event, newValue) => {
        this.setState({ [name]: newValue });
    };

    handleSubmit = () => {
        if (this.props.selectedAsset && this.props.selectedAsset.assetName && this.props.selectedAsset.assetMargin && this.state.quantity && this.state.price) {
            this.setState({ isSending: true }, () => {
                const newOffer = this.props.firebase.functions().httpsCallable('newOffer');
                newOffer({
                    offerAsset: this.props.selectedAsset.assetName,
                    offerIsBuy: !Boolean(this.state.isBuy),
                    offerOwnerId: this.props.auth.uid,
                    offerPrice: this.state.price,
                    offerQuantity: this.state.quantity,
                    metaMargin: this.props.selectedAsset.assetMargin,
                    metaProfile: this.props.profile
                }).then((res)=>{
                    console.log(res);
                    if (res.data && res.data.success) {
                        this.setState({ quantity: '', price: '', isSending: false, snackbarOpen: true, snackbarVariant: 'success', snackbarMessage: 'Oferta Enviada com Sucesso!' })
                    } else if (res.data.error === 'NO_MARGIN') {
                        this.setState({ isSending: false, snackbarOpen: true, snackbarVariant: 'warning', snackbarMessage: 'Margem Insuficiente!' })
                    } else {
                        this.setState({ quantity: '', price: '', isSending: false, snackbarOpen: true, snackbarVariant: 'error', snackbarMessage: 'Ops! Algo Deu Errado, Tente Novamente' })
                    }
                })
            });
        } else if (!this.state.quantity || !this.state.price) {
            this.setState({ snackbarOpen: true, snackbarVariant: 'warning', snackbarMessage: 'Preço ou Quantidade inválido(a)' })
        } else {
            this.setState({ snackbarOpen: true, snackbarVariant: 'warning', snackbarMessage: 'Nenhum Ativo Selecionado!' })
        }

    };

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({snackbarOpen: false});
    };

    render() {
        const { classes, selectedAsset } = this.props;
        const { quantity, price, isBuy, isSending, snackbarOpen, snackbarVariant, snackbarMessage } = this.state;
        return (
            <Paper className={classes.paper}>
                <CssBaseline/>
                <Grid
                    container
                    direction="column"
                    justify="flex-start"
                    alignItems="center"
                >
                    <Typography variant="h5" gutterBottom>
                        {selectedAsset ? selectedAsset.assetName : 'Selecione um Ativo'}
                    </Typography>

                    <Tabs value={isBuy} onChange={this.handleTab('isBuy')} aria-label="comprar ou vender" className={classes.tabs}>
                        <Tab label="COMPRAR" />
                        <Tab label="VENDER" />
                    </Tabs>

                    <Divider/>

                    <TextField
                        className={classes.textInput}
                        variant="outlined"
                        label="Preço"
                        value={price}
                        onChange={this.handleChangeFloat('price')}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">$</InputAdornment>,
                        }}
                        margin={'dense'}
                        fullWidth={true}
                        type="number"
                        inputProps={{
                            step: 0.01,
                        }}
                    />
                    <TextField
                        className={classes.textInput}
                        variant="outlined"
                        label="Quantidade"
                        value={quantity}
                        onChange={this.handleChangeInt('quantity')}
                        margin={'dense'}
                        fullWidth={true}
                        type="number"
                    />
                    <Grid
                        container
                        direction="row"
                        justify="space-between"
                        alignItems="center"
                        style={{marginBottom: 12}}
                    >
                        <Typography variant="subtitle2" gutterBottom>
                            Ordem Total:
                        </Typography>
                        <Typography variant="overline" gutterBottom>
                            {quantity * price}
                        </Typography>
                    </Grid>

                    <Button
                        variant="outlined"
                        color="primary"
                        className={classes.button}
                        fullWidth={true}
                        onClick={this.handleSubmit}
                        disabled={isSending}
                        type="submit"
                    >
                        CONFIRMAR ORDEM
                    </Button>


                </Grid>

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
        selectedAsset: state.stockList.selectedAsset ? state.stockList.selectedAsset : null,
        auth: state.firebase.auth,
        profile: state.firebase.profile
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
)(NewOrder)