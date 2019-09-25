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

const styles = theme => ({
    paper: {
        width: '100%',
        maxWidth: 300,
    },
    priceHeader: {
        margin: '0px 15px 0px 20px'
    },
    quantityHeader: {
        margin: '0px 15px 0px 25px'
    },
    totalHeader: {
        margin: '0px 15px 0px 30px'
    },
    priceBuy: {
        width: '30%',
        textAlign: 'center',
        color: 'rgb(112, 168, 0)'
    },
    priceSell: {
        width: '30%',
        textAlign: 'center',
        color: 'rgb(234, 0, 112)'
    },
    quantity: {
        width: '40%',
        textAlign: 'center'
    },
    total: {
        width: '30%',
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
                <List subheader={
                    <ListSubheader>
                        <span className={classes.priceHeader}>preço</span>
                        <span className={classes.quantityHeader}>quantidade</span>
                        <span className={classes.totalHeader}>total</span>
                    </ListSubheader>
                } component="nav" aria-label="main mailbox folders">
                    {[20,19,18,17,16,15,14,13,12,11].map(price => (
                        <ListItem button dense>
                            <span className={classes.priceSell}>{price}</span>
                            <span className={classes.quantity}>10</span>
                            <span className={classes.total}>200</span>
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