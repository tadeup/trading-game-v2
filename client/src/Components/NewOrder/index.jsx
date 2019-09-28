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
    };

    handleChange = name => event => {
        this.setState({ [name]: event.target.value });
    };

    handleTab = name => (event, newValue) => {
        this.setState({ [name]: newValue });
    };

    render() {
        const { classes } = this.props;
        const { quantity, price, isBuy } = this.state;
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
                        Ordem
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
                        onChange={this.handleChange('price')}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">$</InputAdornment>,
                        }}
                        margin={'dense'}
                        fullWidth={true}
                    />
                    <TextField
                        className={classes.textInput}
                        variant="outlined"
                        label="Quantidade"
                        value={quantity}
                        onChange={this.handleChange('quantity')}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">$</InputAdornment>,
                        }}
                        margin={'dense'}
                        fullWidth={true}
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

                    <Button variant="contained" color="primary" className={classes.button} fullWidth={true} onClick={this.handleLogin}>
                        CONFIRMAR ORDEM
                    </Button>


                </Grid>

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
)(NewOrder)