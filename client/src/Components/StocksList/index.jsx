import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firestoreConnect, firebaseConnect } from 'react-redux-firebase'
import { actionTypes } from "redux-firestore";
import CssBaseline from "@material-ui/core/es/CssBaseline/CssBaseline";
import {GridList, GridListTile, Paper, ButtonBase, withStyles, TextField} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";

export const styles = theme => ({
    gridList: {
        maxHeight: 630
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
        boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.12)'
    },
    buttonGridContainer: {
        marginLeft: 8,
        marginRight: 0
    },
    tableHeader: {
        paddingLeft: 8,
        whiteSpace: 'nowrap'
    },
    timestamp: {
        color: 'rgb(153, 153, 153)'
    },
    lastPricesUp: {
        color: 'rgb(234, 0, 112)',
    },
    lastPricesDown: {
        color: 'rgb(112, 168, 0)',
    }
});

// STATEFUL
class StocksList extends Component {
    state = {  };

    render() {
        const { classes } = this.props;
        return (
            <>
                <CssBaseline/>
                <GridList cellHeight={140} className={classes.gridList} cols={1}>
                    {[1,2,3,4 ,5].map(el=>(
                        <ButtonBase focusRipple className={classes.buttonElement}>
                            <Grid
                                container
                                direction="row"
                                justify="space-between"
                                alignItems="center"
                                spacing={2}
                                className={classes.buttonGridContainer}
                            >
                                <Grid item xs={3} className={classes.itemFirst}>
                                    <Typography variant="h4">
                                        Ativo 1
                                    </Typography>
                                    <Typography variant="h6" color="textSecondary">
                                        Posição: 666
                                    </Typography>
                                    <Typography variant="h6" color="textSecondary">
                                        Total: 1000
                                    </Typography>
                                </Grid>
                                <Grid item xs={5}>
                                    <Table size="small" >
                                        <TableHead>
                                            <TableRow>
                                                <TableCell className={classes.tableHeader}>Últimas Atividades</TableCell>
                                                <TableCell/>
                                                <TableCell/>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody className={classes.tableActivity}>
                                            <TableRow>
                                                <TableCell component="th" scope="row" className={classes.lastPricesUp}>10</TableCell>
                                                <TableCell align="left">20</TableCell>
                                                <TableCell align="right" className={classes.timestamp}>09:49:06</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell component="th" scope="row" className={classes.lastPricesUp}>10</TableCell>
                                                <TableCell align="left">20</TableCell>
                                                <TableCell align="right" className={classes.timestamp}>09:49:06</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell component="th" scope="row" className={classes.lastPricesDown}>10</TableCell>
                                                <TableCell align="left">20</TableCell>
                                                <TableCell align="right" className={classes.timestamp}>09:49:06</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </Grid>
                                <Grid item xs={4}>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell className={classes.tableHeader}>Book</TableCell>
                                                <TableCell></TableCell>
                                            </TableRow>
                                        </TableHead>
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
                    ))}
                </GridList>
            </>
        );
    }
}

StocksList.propTypes = {
    // Optional props

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

    }
};

export default compose(
    withStyles(styles),
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect(),
)(StocksList)