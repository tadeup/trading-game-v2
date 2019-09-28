import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firestoreConnect, firebaseConnect } from 'react-redux-firebase'
import { actionTypes } from "redux-firestore";
import CssBaseline from "@material-ui/core/es/CssBaseline/CssBaseline";
import {Paper, withStyles} from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Button from "@material-ui/core/Button";

export const styles = theme => ({
    main: {
        minWidth: 350,
        height: 280,
        overflow: 'auto',
    },
    tableBody: {

    },
    cancelButton: {
        lineHeight: '18px',
        padding: '0 3px',
        textTransform: 'none',
        color: 'rgb(200,200,200)',
        borderRadius: 2
    },
    cancelAllButton: {
        lineHeight: '18px',
        padding: '0 3px',
        textTransform: 'none',
        borderRadius: 2
    }
});

// STATEFUL
class SelfLastOrders extends Component {
    state = {  };

    render() {
        const { classes } = this.props;
        return (
            <Paper className={classes.main}>
                <CssBaseline/>
                <Table className={classes.table} size="small" stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Preço</TableCell>
                            <TableCell align="left">Quantidade</TableCell>
                            <TableCell align="right">
                                <Button className={classes.cancelAllButton} color="secondary">
                                    Cancelar Todos
                                </Button>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody className={classes.tableBody}>
                        {/*<TableRow key={0}>*/}
                        {/*    <TableCell align="left">{0}</TableCell>*/}
                        {/*    <TableCell align="left">{0}</TableCell>*/}
                        {/*    <TableCell align="center">{0}</TableCell>*/}
                        {/*</TableRow>*/}
                        {[1,2,3,4,5,6,7,8,9,10].map(row => (
                            <TableRow key={row}>
                                <TableCell align="left">{row}</TableCell>
                                <TableCell align="left">{row}</TableCell>

                                <TableCell align="right">
                                    <Button className={classes.cancelButton} variant={'outlined'}>
                                        Cancelar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        );
    }
}

SelfLastOrders.propTypes = {
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
)(SelfLastOrders)