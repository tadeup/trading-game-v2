import React from 'react';
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase'
import CssBaseline from "@material-ui/core/es/CssBaseline/CssBaseline";
import {ButtonBase, withStyles} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
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
    }
});

// STATELESS
const StockListItem = (props) => {
    const { classes, asset, activity } = props;

    const handleClick = asset => event => {
        props.selectAsset(asset)
    };

    return (
        <ButtonBase focusRipple className={classes.buttonElement} key={asset} onClick={handleClick(asset)}>
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
                    <Typography variant="h5">
                        {asset.assetName}
                    </Typography>
                    <Typography variant="h6" color="textSecondary">
                        Posição: 666
                    </Typography>
                    <Typography variant="h6" color="textSecondary">
                        Total: 1000
                    </Typography>
                </Grid>
                <Grid item xs={4} className={classes.gridItem}>
                    <Typography className={classes.tableHeader}>Últimas Atividades</Typography>
                    <Table size="small" >
                        <TableBody className={classes.tableActivity}>
                            {activity.length === 4
                                ? activity.map((el, index, arr) => {
                                    if (!arr[index+1]) return null;
                                    const isUp = el.price >= arr[index+1].price;
                                    return (
                                        <TableRow key={index}>
                                            <TableCell align="left" className={clsx(isUp ? classes.lastPricesUp : classes.lastPricesDown)}>{el.price} {isUp ? '↑' : '↓'}</TableCell>
                                            <TableCell align="left">{el.quantity}</TableCell>
                                            <TableCell align="right" className={classes.timestamp}>{moment(el.date.toDate()).format('h:mm:ss')}</TableCell>
                                        </TableRow>
                                    )
                                })
                                : (
                                    <TableRow>
                                        <TableCell align="left">Histórico Indisponível</TableCell>
                                    </TableRow>
                                )}
                        </TableBody>
                    </Table>
                </Grid>
                <Grid item xs={4} className={classes.gridItem}>
                    <Typography className={classes.tableHeader}>Book</Typography>
                    <Table size="small">
                        <TableBody className={classes.tableBook}>
                            <TableRow style={{backgroundColor: 'rgba(255,44,120,0.1)'}}>
                                <TableCell component="th" scope="row">11</TableCell>
                                <TableCell align="right">20</TableCell>
                            </TableRow>
                            <TableRow style={{backgroundColor: 'rgb(247, 247, 247)'}}>
                                <TableCell component="th" scope="row">10</TableCell>
                                <TableCell align="right">20</TableCell>
                            </TableRow>
                            <TableRow style={{backgroundColor: 'rgba(57, 255, 0, 0.1)'}}>
                                <TableCell component="th" scope="row">9</TableCell>
                                <TableCell align="right">20</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Grid>
            </Grid>
        </ButtonBase>
    );
};

const mapStateToProps = (state, ownProps) => {
    return {
        selectedAsset: state.stockList.selectedAsset ? state.stockList.selectedAsset.assetName : null,
        activity: state.firestore.ordered[ownProps.asset.assetName] || []
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
                limit: 4,
                storeAs: props.asset.assetName
            }
        ]
    }),
)(StockListItem)