import React, {Component} from 'react';
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase'
import CssBaseline from "@material-ui/core/es/CssBaseline/CssBaseline";
import {Paper, Table, withStyles} from "@material-ui/core";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";

export const styles = theme => ({
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
});

// STATEFUL
class SelfAssets extends Component {
    state = {

    };

    render() {
        const { classes, profile, buyer, seller } = this.props;
        const {  } = this.state;
        const positions = {};
        Object.keys(profile.positions).forEach(el=>{positions[el]=0});

        buyer.forEach(transaction => {
            const finalPrice = this.props.assets.filter(el => el.assetName === transaction.asset)[0];
            positions[transaction.asset] += finalPrice && finalPrice.hasOwnProperty('assetFinalPrice')
                ? ( (-transaction.price + finalPrice.assetFinalPrice ) * transaction.quantity )
                : 0
        });
        seller.forEach(transaction => {
            const finalPrice = this.props.assets.filter(el => el.assetName === transaction.asset)[0];
            positions[transaction.asset] += finalPrice && finalPrice.hasOwnProperty('assetFinalPrice')
                ? ( (transaction.price - finalPrice.assetFinalPrice ) * transaction.quantity )
                : 0
        });

        return (
            <Paper>
                <CssBaseline/>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Ativo</TableCell>
                            <TableCell>Posição Aberta</TableCell>
                            <TableCell>Posição Fechada</TableCell>
                            <TableCell>Resultado</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.entries(positions).map((asset, key) => (
                            <TableRow key={key}>
                                <TableCell>{asset[0]}</TableCell>
                                <TableCell>{profile.positions[asset[0]] && profile.positions[asset[0]].open}</TableCell>
                                <TableCell>{profile.positions[asset[0]] && profile.positions[asset[0]].closed}</TableCell>
                                <TableCell>{asset[1].toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        );
    }
}

const mapStateToProps = state => {
    return {
        auth: state.firebase.auth,
        profile: state.firebase.profile,
        buyer: state.firestore.ordered.buyer || [],
        seller: state.firestore.ordered.seller || [],
        assets: state.firestore.ordered.assetsList || [],
    }
};

const mapDispatchToProps = dispatch => {
    return {

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
                    ['buyer', '==', props.auth.uid],
                ],
                storeAs: 'buyer'
            },
            {
                collection: 'transactions',
                where: [
                    ['seller', '==', props.auth.uid],
                ],
                storeAs: 'seller'
            },
            {
                collection: 'assets',
                storeAs: 'assetsList'
            }
        ]
    }),
)(SelfAssets)