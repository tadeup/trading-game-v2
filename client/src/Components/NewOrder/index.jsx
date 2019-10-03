import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firestoreConnect, firebaseConnect } from 'react-redux-firebase'
import { actionTypes } from "redux-firestore";
import CssBaseline from "@material-ui/core/es/CssBaseline/CssBaseline";
import {Paper, Typography, withStyles} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

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
        isSending: false
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
        const x = Number(event.target.value);
        if (x <= 0) {
            this.setState({ [name]:  ''});
        }
        else {
            this.setState({ [name]:  x});
        }

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
        this.setState({ isSending: true }, () => {
            this.props.firestore.add(
                { collection: 'offers'},
                {
                    offerOwnerId: this.props.auth.uid,
                    offerAsset: this.props.selectedAsset.assetName,
                    offerQuantity: this.state.quantity,
                    offerFilled: 0,
                    offerPrice: this.state.price,
                    offerIsBuy: !Boolean(this.state.isBuy),
                    offerIsCanceled: false,
                    offerIsFilled: false,
                }
            ).then(()=>{
                this.setState({ isSending: false })
            })
        });

        // const newOffer = this.props.firebase.functions().httpsCallable('newOffer');
        // newOffer({
        //     offerOwnerId: this.props.auth.uid,
        //     offerAsset: this.props.selectedAsset.assetName,
        //     offerQuantity: this.state.quantity,
        //     offerFilled: 0,
        //     offerPrice: this.state.price,
        //     offerIsBuy: !Boolean(this.state.isBuy),
        //     offerIsCanceled: false,
        //     offerIsFilled: false,
        // }).then((res)=>{console.log(res)})
    };

    render() {
        const { classes, selectedAsset } = this.props;
        const { quantity, price, isBuy, isSending } = this.state;
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
                    >
                        <Typography variant="subtitle2" gutterBottom>
                            Mercado:
                        </Typography>
                        <Typography variant="overline" gutterBottom>
                            1111
                        </Typography>
                    </Grid>
                    <Grid
                        container
                        direction="row"
                        justify="space-between"
                        alignItems="center"
                    >
                        <Typography variant="subtitle2" gutterBottom>
                            Ordem Total:
                        </Typography>
                        <Typography variant="overline" gutterBottom>
                            1111
                        </Typography>
                    </Grid>

                    <Button variant="contained" color="primary" className={classes.button} fullWidth={true} onClick={this.handleSubmit} disabled={isSending}>
                        CONFIRMAR ORDEM
                    </Button>


                </Grid>

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