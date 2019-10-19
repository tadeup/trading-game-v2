import React, {Component} from 'react';
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase'
import CssBaseline from "@material-ui/core/es/CssBaseline/CssBaseline";
import {Paper, Table, withStyles} from "@material-ui/core";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/core/SvgIcon/SvgIcon";
import Typography from "@material-ui/core/Typography";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";

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
        const finalValue = 10;

        buyer.forEach(transaction => {
            positions[transaction.asset] += (transaction.price - finalValue) * transaction.quantity
        });
        seller.forEach(transaction => {
            positions[transaction.asset] -= (transaction.price - finalValue) * transaction.quantity
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
                                <TableCell>{asset[1]}</TableCell>
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
        ]
    }),
)(SelfAssets)