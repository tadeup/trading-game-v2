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
import clsx from "clsx";

const styles = theme => ({
    paper: {
        height: 646,
        // height: '85vh',
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
    },
    sellOffersList: {
        display: 'flex',
        flexDirection: 'column',
        height: 270,
        borderTop: '1px solid #e8e8e8'
    },
    sellOffersFirstChild: {
        marginTop: 'auto'
    },
});

class Book extends Component {
    state = {  };

    render() {
        const { classes, buyOffers, sellOffers, selectedAsset, lastPrice } = this.props;

        let sellOffersReduced = [];
        sellOffers.forEach((el, index)=>{
            const len = sellOffersReduced.length;
            if (len && el.offerPrice === sellOffersReduced[len-1].offerPrice) {
                sellOffersReduced[len-1].offerFilled += el.offerFilled
            } else {
                sellOffersReduced.push({...el})
            }
        });
        sellOffersReduced=sellOffersReduced.slice(Math.max(sellOffersReduced.length - 9, 0))

        const buyOffersReduced = [];
        buyOffers.forEach((el, index)=>{
            const len = buyOffersReduced.length;
            if (len && len >= 9) {
                return
            } if (len && el.offerPrice === buyOffersReduced[len-1].offerPrice) {
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
                            <Grid item xs={6} className={classes.priceHeader}>
                                Preço
                            </Grid>
                            <Grid item xs={6} className={classes.quantityHeader}>
                                Quantidade
                            </Grid>
                        </Grid>
                    </ListItem>
                </List>
                <List className={classes.sellOffersList}>
                    {sellOffersReduced.map((price, key) => (
                        <ListItem button dense key={key} className={clsx({[classes.sellOffersFirstChild]: key===0})}>
                            <Grid
                                container
                                direction="row"
                                justify="space-between"
                                alignItems="stretch"
                            >
                                <Grid item xs={6} className={classes.priceSell}>
                                    {price.offerPrice}
                                </Grid>
                                <Grid item xs={6} className={classes.quantity}>
                                    {price.offerFilled}
                                </Grid>
                            </Grid>
                        </ListItem>
                    ))}
                </List>
                <List>
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
                                    <Grid item xs={6} className={classes.last}>
                                        <Typography variant="h6">
                                            -
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6} className={classes.last}>
                                        <Typography variant="h6">
                                            -
                                        </Typography>
                                    </Grid>
                                </Grid>
                            )}
                    </ListItem>
                </List>
                <List style={{height:270}}>
                    {buyOffersReduced.map((price, key) => (
                        <ListItem button dense key={key}>
                            <Grid
                                container
                                direction="row"
                                justify="space-between"
                                alignItems="stretch"
                            >
                                <Grid item xs={6} className={classes.priceBuy}>
                                    {price.offerPrice}
                                </Grid>
                                <Grid item xs={6} className={classes.quantity}>
                                    {price.offerFilled}
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
                limit: 40,
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
                limit: 40,
                storeAs: 'sellOffers'
            }
        ]
    }),
)(Book)