import React, {Component} from 'react';
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase'
import { actionTypes } from "redux-firestore";
import CssBaseline from "@material-ui/core/es/CssBaseline/CssBaseline";
import {Paper, Table, TextField, withStyles} from "@material-ui/core";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";

export const styles = theme => ({
    textField: {

    }
});

// STATEFUL
class AssetsList extends Component {
    state = {

    };

    render() {
        const { classes, assetsList } = this.props;
        const {  } = this.state;
        return (
            <Paper>
                <CssBaseline/>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Ativo</TableCell>
                            <TableCell align="center">Status</TableCell>
                            <TableCell align="center">Margem</TableCell>
                            <TableCell align="center">Preço Final</TableCell>
                            <TableCell align="center">Apagar</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {assetsList.map((asset, index) => (
                            <TableRow key={index}>
                                <TableCell align="center">{asset.assetName}</TableCell>
                                <TableCell align="center">{asset.assetIsActive ? 'Ativo' : 'Inativo'}</TableCell>
                                <TableCell align="center">{asset.assetMargin}</TableCell>
                                <TableCell align="center"><TextField/></TableCell>
                                <TableCell align="center">x</TableCell>
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
        assetsList: state.firestore.ordered.assetsList || []
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
                collection: 'assets',
                storeAs: 'assetsList'
            },
        ]
    }),
)(AssetsList)