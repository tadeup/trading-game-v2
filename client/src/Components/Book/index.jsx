import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firestoreConnect, firebaseConnect } from 'react-redux-firebase'
import { actionTypes } from "redux-firestore";
import CssBaseline from "@material-ui/core/es/CssBaseline/CssBaseline";
import {Paper, Typography, withStyles} from "@material-ui/core";
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
    priceCentral: {
        backgroundColor: 'rgb(247, 247, 247)',
    }
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
                        <ListItem button dense key={price}>
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

                    <ListItem className={classes.priceCentral} dense>
                        <Grid container>
                            <Grid item xs={1}/>
                            <Typography variant="h6">
                                10.5
                            </Typography>
                        </Grid>
                    </ListItem>

                    {[10,9,8,7,6,5,4,3,2,1].map(price => (
                        <ListItem button dense key={price}>
                            <Grid
                                container
                                direction="row"
                                justify="space-between"
                                alignItems="stretch"
                            >
                                <Grid item xs={4} className={classes.priceBuy}>
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
        clearFirestore: () => dispatch({ type: actionTypes.CLEAR_DATA })
    }
};

export default compose(
    withStyles(styles),
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect(),
)(Book)