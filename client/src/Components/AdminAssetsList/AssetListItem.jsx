import React, {Component} from 'react';
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase'
import { actionTypes } from "redux-firestore";
import CssBaseline from "@material-ui/core/es/CssBaseline/CssBaseline";
import {Paper, Table, TextField, withStyles} from "@material-ui/core";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from '@material-ui/icons/Close';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

export const styles = theme => ({
    finalPriceField: {
        margin: 'auto'
    },
    finalPriceButton: {
        margin: '1px 0 0 8px'
    }
});

// STATEFUL
class AssetsListItem extends Component {
    state = {
        finalPrice: this.props.asset.assetFinalPrice || '',
        isEditingLocked: true
    };

    handleActivate = asset => event => {
        this.props.firestore.update({ collection: 'assets', doc: asset.id }, {assetIsActive: !asset.assetIsActive})
    };

    handleChange = name => event => {
        const x = Number(event.target.value);
        if (x <= 0) {
            this.setState({ [name]:  ''});
        }
        else {
            this.setState({ [name]:  x});
        }
    };

    handleSetFinalPrice = asset => event => {
        this.props.firestore.update({ collection: 'assets', doc: asset.id }, {assetIsActive: false, assetFinalPrice: Number(this.state.finalPrice)})
        this.setState({isEditingLocked: true})
    };

    handleEditFinalPrice = event => {
        // this.props.firestore.update({ collection: 'assets', doc: asset.id }, {assetFinalPrice: this.props.firestore.FieldValue.delete()})
        this.setState({isEditingLocked: false})
    };

    render() {
        const { classes, assetsList, index, asset } = this.props;
        const { finalPrice, isEditingLocked } = this.state;
        return (
            <TableRow key={index}>
                <CssBaseline/>
                <TableCell align="center">{asset.assetName}</TableCell>
                <TableCell align="center">
                    <FormControlLabel
                        control={
                            <Switch
                                checked={asset.assetIsActive}
                                onChange={this.handleActivate(asset)}
                                value="checkedB"
                                color="primary"
                            />
                        }
                        label={asset.assetIsActive ? 'Ativo' : 'Inativo'}
                    />
                </TableCell>
                <TableCell align="center">{asset.assetMargin}</TableCell>
                <TableCell align="center">
                    <TextField
                        value={finalPrice}
                        onChange={this.handleChange('finalPrice')}
                        disabled={isEditingLocked && Boolean(asset.assetFinalPrice)}
                        variant="outlined"
                        margin="dense"
                        type="number"
                        inputProps={{
                            step: 0.01,
                        }}
                        className={classes.finalPriceField}
                    />
                    {isEditingLocked && Boolean(asset.assetFinalPrice)
                        ? (<Button onClick={this.handleEditFinalPrice} className={classes.finalPriceButton}>Editar</Button>)
                        : (<Button onClick={this.handleSetFinalPrice(asset)} className={classes.finalPriceButton}>Salvar</Button>)
                    }
                </TableCell>
                <TableCell align="center">
                    <IconButton color="secondary" className={classes.button} aria-label="add an alarm">
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </TableCell>
            </TableRow>
        );
    }
}

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
)(AssetsListItem)