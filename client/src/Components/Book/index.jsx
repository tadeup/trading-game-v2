import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firestoreConnect, firebaseConnect } from 'react-redux-firebase'
import { actionTypes } from "redux-firestore";
import CssBaseline from "@material-ui/core/es/CssBaseline/CssBaseline";
import {Paper, withStyles} from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import Grid from "@material-ui/core/Grid";

const styles = theme => ({
    paper: {
        minWidth: 300,
    },
    priceHeader: {
        color: 'rgb(153, 153, 153)',
        textAlign: 'center'
    },
    quantityHeader: {
        color: 'rgb(153, 153, 153)',
        textAlign: 'center'
    },
    totalHeader: {
        color: 'rgb(153, 153, 153)',
        textAlign: 'center'
    },
    gridHeader: {

    },
    priceBuy: {
        width: '30%',
        textAlign: 'center',
        color: 'rgb(112, 168, 0)'
    },
    priceSell: {
        textAlign: 'center',
        color: 'rgb(234, 0, 112)'
    },
    quantity: {
        textAlign: 'center'
    },
    total: {
        textAlign: 'center'
    },
});

class Book extends Component {
    state = {  };

    render() {
        const { classes } = this.props;
        return (
            <Paper className={classes.paper}>
                <CssBaseline/>
                <List component="nav" aria-label="main mailbox folders">
                    <ListItem dense>
                        <Grid
                            container
                            direction="row"
                            justify="space-between"
                            alignItems="stretch"
                            className={classes.gridHeader}
                        >
                            <Grid item xs={4} className={classes.priceHeader}>
                                Preço
                            </Grid>
                            <Grid item xs={4} className={classes.quantityHeader}>
                                Quantidade
                            </Grid>
                            <Grid item xs={4} className={classes.totalHeader}>
                                Total
                            </Grid>
                        </Grid>
                    </ListItem>
                    {[20,19,18,17,16,15,14,13,12,11].map(price => (
                        <ListItem button dense>
                            <Grid
                                container
                                direction="row"
                                justify="space-between"
                                alignItems="stretch"
                            >
                                <Grid item xs={4} className={classes.priceSell}>
                                    {price}
                                </Grid>
                                <Grid item xs={4} className={classes.quantity}>
                                    10
                                </Grid>
                                <Grid item xs={4} className={classes.total}>
                                    {price * 10}
                                </Grid>
                            </Grid>
                        </ListItem>
                    ))}
                </List>

                <Divider/>

                <List component="nav" aria-label="main mailbox folders">
                    {[10,9,8,7,6,5,4,3,2,1].map(price => (
                        <ListItem button dense>
                            <span className={classes.priceBuy}>{price}</span>
                            <span className={classes.quantity}>10</span>
                            <span className={classes.total}>200</span>
                        </ListItem>
                    ))}
                </List>
            </Paper>
        );
    }
}

Book.propTypes = {
    // Optional props
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
)(Book)