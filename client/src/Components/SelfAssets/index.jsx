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
        Object.entries(profile.positions).forEach(asset=>{
            const avgBuyPrice = asset[1].buyQuantity ? asset[1].avgBuyPrice / asset[1].buyQuantity : 0;
            const avgSellPrice = asset[1].sellQuantity ? asset[1].avgSellPrice / asset[1].sellQuantity : 0;
            const finalPrice = this.props.assets.filter(el => el.assetName === asset[0])[0];
            positions[asset[0]] = finalPrice && finalPrice.hasOwnProperty('assetFinalPrice')
                ? ((avgSellPrice - finalPrice.assetFinalPrice) * asset[1].sellQuantity - (avgBuyPrice - finalPrice.assetFinalPrice) * asset[1].buyQuantity).toFixed(2)
                : 'Indisponível';
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
                collection: 'assets',
                storeAs: 'assetsList'
            }
        ]
    }),
)(SelfAssets)