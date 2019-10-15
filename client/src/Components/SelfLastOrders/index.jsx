import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firestoreConnect, firebaseConnect } from 'react-redux-firebase'
import { actionTypes } from "redux-firestore";
import CssBaseline from "@material-ui/core/es/CssBaseline/CssBaseline";
import {Paper, Snackbar, withStyles} from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Button from "@material-ui/core/Button";
import MySnackbarContentWrapper from "../CustomizedSnackbars";

export const styles = theme => ({
    main: {
        width: 350,
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
    state = {
        snackbarOpen: false,
        snackbarVariant: 'info',
        snackbarMessage: ''
    };

    handleCancel = offer => () => {
        const deleteOffers = this.props.firebase.functions().httpsCallable('deleteOffers');
        deleteOffers({
            offers: [offer],
            offerOwnerId: this.props.auth.uid,
            offerAsset: offer.offerAsset
        }).then((res)=>{
            console.log(res);
            if (res.data && res.data.success) {
                this.setState({ snackbarOpen: true, snackbarVariant: 'success', snackbarMessage: 'Oferta Cancelada com Sucesso!' })
            } else {
                this.setState({ snackbarOpen: true, snackbarVariant: 'error', snackbarMessage: 'Ops! Algo Deu Errado, Tente Novamente' })
            }
        })
    };

    handleCancelAll = offers => () => {
        if (offers.length) {
            const offerAsset = offers[0].offerAsset;
            const deleteOffers = this.props.firebase.functions().httpsCallable('deleteOffers');
            deleteOffers({
                offers: offers,
                offerOwnerId: this.props.auth.uid,
                offerAsset
            }).then((res)=>{
                console.log(res);
                if (res.data && res.data.success) {
                    this.setState({ snackbarOpen: true, snackbarVariant: 'success', snackbarMessage: 'Oferta Cancelada com Sucesso!' })
                } else {
                    this.setState({ snackbarOpen: true, snackbarVariant: 'error', snackbarMessage: 'Ops! Algo Deu Errado, Tente Novamente' })
                }
            })
        } else {
            this.setState({ snackbarOpen: true, snackbarVariant: 'warning', snackbarMessage: 'Nenhuma oferta Encontrada!' })
        }
    };

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({snackbarOpen: false});
    };

    render() {
        const { classes, selfOffers } = this.props;
        const { snackbarOpen, snackbarMessage, snackbarVariant } = this.state;
        return (
            <Paper className={classes.main}>
                <CssBaseline/>
                <Table className={classes.table} size="small" stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Preço</TableCell>
                            <TableCell align="left">Qtd.</TableCell>
                            <TableCell align="left">Tipo</TableCell>
                            <TableCell align="right">
                                <Button className={classes.cancelAllButton} color="secondary" onClick={this.handleCancelAll(selfOffers)}>
                                    Cancelar Todos
                                </Button>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody className={classes.tableBody}>
                        {selfOffers.map(offer => (
                            <TableRow key={offer.id}>
                                <TableCell align="left">{offer.offerPrice}</TableCell>
                                <TableCell align="left">{offer.offerFilled}</TableCell>
                                <TableCell align="left">{offer.offerIsBuy ? "compra" : "venda"}</TableCell>
                                <TableCell align="right">
                                    <Button className={classes.cancelButton} variant={'outlined'} onClick={this.handleCancel(offer)}>
                                        Cancelar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    autoHideDuration={1000}
                    onClose={this.handleClose}
                    open={snackbarOpen}
                >
                    <MySnackbarContentWrapper
                        onClose={this.handleClose}
                        variant={snackbarVariant}
                        message={snackbarMessage}
                    />
                </Snackbar>

            </Paper>
        );
    }
}

const mapStateToProps = state => {
    return {
        selfOffers: state.firestore.ordered.buyOffers && state.firestore.ordered.sellOffers
            ? [...state.firestore.ordered.buyOffers, ...state.firestore.ordered.sellOffers].filter(offer=>offer.offerOwnerId===state.firebase.auth.uid)
            : [],
        auth: state.firebase.auth,
        profile: state.firebase.profile
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