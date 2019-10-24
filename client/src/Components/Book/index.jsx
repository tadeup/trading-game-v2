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
        minHeight: 646,
        height: '85vh',
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
    },
    last: {
        textAlign: 'center',
        color: 'rgb(153, 153, 153)',
    }
});

class Book extends Component {
    state = {  };

    render() {
        const { classes, buyOffers, sellOffers, selectedAsset, lastPrice } = this.props;

        const sellOffersReduced = [];
        sellOffers.forEach((el, index)=>{
            const len = sellOffersReduced.length;
            if (len && el.offerPrice === sellOffersReduced[len-1].offerPrice) {
                sellOffersReduced[len-1].offerFilled += el.offerFilled
            } else {
                sellOffersReduced.push({...el})
            }
        });

        const buyOffersReduced = [];
        buyOffers.forEach((el, index)=>{
            const len = buyOffersReduced.length;
            if (len && el.offerPrice === buyOffersReduced[len-1].offerPrice) {
                buyOffersReduced[len-1].offerFilled += el.offerFilled
            } else {
                buyOffersReduced.push({...el})
            }
        });

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
                    {sellOffersReduced.map((price, key) => (
                        <ListItem button dense key={key}>
                            <Grid
                                container
                                direction="row"
                                justify="space-between"
                                alignItems="stretch"
                            >
                                <Grid item xs={4} className={classes.priceSell}>
                                    {price.offerPrice}
                                </Grid>
                                <Grid item xs={4} className={classes.quantity}>
                                    {price.offerFilled}
                                </Grid>
                                <Grid item xs={4} className={classes.total}>
                                    {(price.offerPrice * price.offerFilled).toFixed(2)}
                                </Grid>
                            </Grid>
                        </ListItem>
                    ))}

                    <ListItem className={classes.priceCentral} dense>
                        {lastPrice.price && lastPrice.quantity
                            ? (
                                <Grid
                                    container
                                    direction="row"
                                    justify="space-between"
                                    alignItems="stretch"
                                >
                                    <Grid item xs={12} className={classes.last}>
                                        <Typography variant="h6">
                                            Último preço: <span style={{marginLeft: 18}}>${lastPrice.price.toFixed(2)}</span>
                                        </Typography>
                                    </Grid>
                                </Grid>
                            ) : (
                                <Grid
                                    container
                                    direction="row"
                                    justify="space-between"
                                    alignItems="stretch"
                                >
                                    <Grid item xs={4} className={classes.last}>
                                        <Typography variant="h6">
                                            -
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4} className={classes.last}>
                                        <Typography variant="h6">
                                            -
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4} className={classes.last}>
                                        <Typography variant="h6">
                                            -
                                        </Typography>
                                    </Grid>
                                </Grid>
                            )}
                    </ListItem>

                    {buyOffersReduced.map((price, key) => (
                        <ListItem button dense key={key}>
                            <Grid
                                container
                                direction="row"
                                justify="space-between"
                                alignItems="stretch"
                            >
                                <Grid item xs={4} className={classes.priceBuy}>
                                    {price.offerPrice}
                                </Grid>
                                <Grid item xs={4} className={classes.quantity}>
                                    {price.offerFilled}
                                </Grid>
                                <Grid item xs={4} className={classes.total}>
                                    {(price.offerPrice * price.offerFilled).toFixed(2)}
                                </Grid>
                            </Grid>
                        </ListItem>
                    ))}
                </List>
            </Paper>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const selectedAsset = state.stockList.selectedAsset ? state.stockList.selectedAsset.assetName : null;
    return {
        selectedAsset: selectedAsset,
        buyOffers: state.firestore.ordered.buyOffers ? state.firestore.ordered.buyOffers : [],
        sellOffers: state.firestore.ordered.sellOffers ? state.firestore.ordered.sellOffers.slice().reverse() : [],
        lastPrice: state.firestore.ordered[selectedAsset] && state.firestore.ordered[selectedAsset].length ? state.firestore.ordered[selectedAsset][0] : {},
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
    firestoreConnect((props) => {
        return [
            {
                collection: 'offers',
                where: [
                    ['offerAsset', '==', props.selectedAsset],
                    ['offerIsCanceled', '==', false],
                    ['offerIsFilled', '==', false],
                    ['offerIsBuy', '==', true],
                ],
                orderBy: ['offerPrice', 'desc'],
                limit: 15,
                storeAs: 'buyOffers'
            },
            {
                collection: 'offers',
                where: [
                    ['offerAsset', '==', props.selectedAsset],
                    ['offerIsCanceled', '==', false],
                    ['offerIsFilled', '==', false],
                    ['offerIsBuy', '==', false],
                ],
                orderBy: ['offerPrice'],
                limit: 15,
                storeAs: 'sellOffers'
            }
        ]
    }),
)(Book)