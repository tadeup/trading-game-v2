import React from 'react';
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase'
import CssBaseline from "@material-ui/core/es/CssBaseline/CssBaseline";
import {ButtonBase, withStyles} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import clsx from 'clsx';
import {selectAsset} from "./redux/actions";
import moment from "moment";

export const styles = theme => ({
    gridItem: {
        marginBottom: 8
    },
    itemFirst: {
        textAlign: 'start',
    },
    tableActivity: {
        border: '1px solid rgba(224, 224, 224, 1)'
    },
    tableBook: {
        border: '1px solid rgba(224, 224, 224, 1)'
    },
    buttonElement: {
        backgroundColor: '#FFF',
        margin: '2px 3px 8px 4px',
        padding: 0,
        boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.12)',
        width: '100%',
        height: 140,
        minWidth: 675
    },
    buttonGridContainer: {
        marginLeft: 8,
        marginRight: 0
    },
    tableHeader: {
        paddingLeft: 8,
        paddingTop:6,
        whiteSpace: 'nowrap',
        color: 'rgba(0, 0, 0, 0.54)',
        fontSize: '0.75rem',
        fontWeight: 500,
        lineHeight: '1.3125rem',
        textAlign: 'start',
        letterSpacing: '0.2em'
    },
    timestamp: {
        color: 'rgb(153, 153, 153)'
    },
    lastPricesUp: {
        color: 'rgb(112, 168, 0)',
    },
    lastPricesDown: {
        color: 'rgb(234, 0, 112)',
    },
    lastPrices: {
        fontWeight: 500,
    },
    bookLables: {
        color: 'rgb(153, 153, 153)',
    },
    textMargin: {
        marginBottom: 8
    }
});

// STATELESS
const StockListItem = (props) => {
    const { classes, asset, activity, buyOffers, sellOffers, profile } = props;

    const avgBuyPrice = profile.positions[asset.assetName].avgBuyPrice / (profile.positions[asset.assetName].buyQuantity || 1);
    const avgSellPrice = profile.positions[asset.assetName].avgSellPrice / (profile.positions[asset.assetName].sellQuantity || 1);
    const buyQuantity = profile.positions[asset.assetName].buyQuantity;
    const sellQuantity = profile.positions[asset.assetName].sellQuantity;

    const handleClick = asset => event => {
        props.selectAsset(asset)
    };

    return (
        <ButtonBase focusRipple className={classes.buttonElement} key={asset.id} onClick={handleClick(asset)}>
            <CssBaseline/>
            <Grid
                container
                direction="row"
                justify="space-between"
                alignItems="center"
                spacing={2}
                className={classes.buttonGridContainer}
            >
                <Grid item xs={4} className={classes.itemFirst}>
                    <Typography variant="h5" className={classes.textMargin}>
                        {asset.assetName}
                    </Typography>
                    <Typography variant="h6" color="textSecondary">
                        Margem: <span style={{marginLeft: 74}}>{asset.assetMargin}</span>
                    </Typography>
                    <Typography variant="h6" color="textSecondary">
                        Posição Aberta: <span style={{marginLeft: 10}}>{profile.positions[asset.assetName].open}</span>
                    </Typography>
                </Grid>
                <Grid item xs={4} className={classes.gridItem}>
                    <Typography className={classes.tableHeader}>Seus Negócios</Typography>
                    <Table size="small" >
                        <TableBody className={classes.tableActivity}>
                            <TableRow>
                                <TableCell align="center"/>
                                <TableCell align="center" style={{whiteSpace: 'nowrap'}}>Avg. Price</TableCell>
                                <TableCell align="center">Qt.</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="center">Sell</TableCell>
                                <TableCell align="center">{avgSellPrice.toFixed(2)}</TableCell>
                                <TableCell align="center">{sellQuantity}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="center">Buy</TableCell>
                                <TableCell align="center">{avgBuyPrice.toFixed(2)}</TableCell>
                                <TableCell align="center">{buyQuantity}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Grid>
                <Grid item xs={4} className={classes.gridItem}>
                    <Typography className={classes.tableHeader}>Spread</Typography>
                    <Table size="small">
                        <TableBody className={classes.tableBook}>
                            <TableRow>
                                <TableCell className={classes.bookLables}>Sell</TableCell>
                                <TableCell align="center" className={clsx(!sellOffers.isEmpty && classes.lastPricesDown)}>{sellOffers.offerPrice ? '$ '+ sellOffers.offerPrice.toFixed(2) : '-'}</TableCell>
                                <TableCell align="center">{sellOffers.offerFilled || '-'}</TableCell>
                            </TableRow>
                            <TableRow style={{backgroundColor: 'rgb(247, 247, 247)'}}>
                                <TableCell className={classes.bookLables}>Last</TableCell>
                                <TableCell align="center">{activity.length ? '$' + activity[0].price.toFixed(2) : '-'}</TableCell>
                                <TableCell align="center">{activity.length ? activity[0].quantity : '-'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className={classes.bookLables}>Buy</TableCell>
                                <TableCell align="center" className={clsx(!buyOffers.isEmpty && classes.lastPricesUp)}>{buyOffers.offerPrice ? '$ ' + buyOffers.offerPrice.toFixed(2) : '-'}</TableCell>
                                <TableCell align="center">{buyOffers.offerFilled || '-'}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Grid>
            </Grid>
        </ButtonBase>
    );
};

const mapStateToProps = (state, ownProps) => {
    const buyOffers = state.firestore.ordered[ownProps.asset.assetName + 'BuyOffers'];
    const sellOffers = state.firestore.ordered[ownProps.asset.assetName + 'SellOffers'];

    return {
        selectedAsset: state.stockList.selectedAsset ? state.stockList.selectedAsset.assetName : null,
        activity: state.firestore.ordered[ownProps.asset.assetName] || [],
        buyOffers: buyOffers && buyOffers[0] ? buyOffers[0] : {offerFilled: null, offerPrice: null, isEmpty: true},
        sellOffers: sellOffers && sellOffers[0] ? sellOffers[0] : {offerFilled: null, offerPrice: null, isEmpty: true},
    }
};

const mapDispatchToProps = dispatch => {
    return {
        selectAsset: payload => dispatch(selectAsset(payload)),
    }
};

export default compose(
    withStyles(styles),
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect((props) => {
        return [
            {
                collection: 'transactions',
                where: [
                    ['asset', '==', props.asset.assetName],
                ],
                orderBy: ['date', 'desc'],
                limit: 1,
                storeAs: props.asset.assetName
            },
            {
                collection: 'offers',
                where: [
                    ['offerAsset', '==', props.asset.assetName],
                    ['offerIsCanceled', '==', false],
                    ['offerIsFilled', '==', false],
                    ['offerIsBuy', '==', true],
                ],
                orderBy: ['offerPrice', 'desc'],
                limit: 1,
                storeAs: props.asset.assetName + 'BuyOffers'
            },
            {
                collection: 'offers',
                where: [
                    ['offerAsset', '==', props.asset.assetName],
                    ['offerIsCanceled', '==', false],
                    ['offerIsFilled', '==', false],
                    ['offerIsBuy', '==', false],
                ],
                orderBy: ['offerPrice'],
                limit: 1,
                storeAs: props.asset.assetName + 'SellOffers'
            }
        ]
    }),
)(StockListItem)