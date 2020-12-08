import React, {Component} from 'react';
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase'
import { actionTypes } from "redux-firestore";
import CssBaseline from "@material-ui/core/es/CssBaseline/CssBaseline";
import {CircularProgress, Dialog, Paper, Table, TextField, withStyles} from "@material-ui/core";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from '@material-ui/icons/Close';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { CSVLink, CSVDownload } from "react-csv";
import moment from "moment";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";

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
        finalPrice: this.props.asset.hasOwnProperty('assetFinalPrice') ?  this.props.asset.assetFinalPrice : '',
        isEditingLocked: true,
        dataToDownload: [],
        isDeleting: false,
        isLoading: false
    };

    handleActivate = asset => event => {
        this.props.firestore.update({ collection: 'assets', doc: asset.id }, {assetIsActive: !asset.assetIsActive})
    };

    handleChange = name => event => {
        const x = Number(event.target.value);

        if (event.target.value === '') {
            this.setState({ [name]:  ''});
        }
        else if (x <= 0) {
            this.setState({ [name]:  0});
        }
        else {
            this.setState({ [name]:  x});
        }
    };

    handleSetFinalPrice = asset => event => {
        if (this.state.finalPrice === '') {
            this.props.firestore.update({ collection: 'assets', doc: asset.id }, {assetIsActive: false, assetFinalPrice: this.props.firestore.FieldValue.delete()});
        } else {
            this.props.firestore.update({ collection: 'assets', doc: asset.id }, {assetIsActive: false, assetFinalPrice: Number(this.state.finalPrice)});
        }
        this.setState({isEditingLocked: true})
    };

    handleEditFinalPrice = event => {
        this.setState({isEditingLocked: false})
    };

    handleDownload = asset => event => {
        this.props.firestore.get({
            collection: 'transactions',
            where: [
                ['asset', '==', asset.assetName],
            ],
            orderBy: ['date', 'desc']
        }).then(data=> {
            const dataToDownload = data.docs.map(doc => ({...doc.data(), date: moment(doc.data().date.toDate()).format('DD-MM-YYYY HH:mm:ss')}));
            this.setState({ dataToDownload }, () => {
                this.csvLink.link.click()
            })
        });
    };

    handleDelete = asset => event => {
        this.setState({isLoading: true});
        const db = this.props.firestore;
        const batch = db.batch();

        this.props.usersList.forEach(user => {
            const userRef = db.collection("users").doc(user.id);
            batch.update(userRef, {['positions.'+asset.assetName]: db.FieldValue.delete()});
        });

        const assetRef = db.collection("assets").doc(asset.id);
        batch.delete(assetRef);

        batch.commit()
            .then(() => {
                this.setState({isDeleting: false});
            });
    };

    handleOpen = () => {
        this.setState({isDeleting: true});
    };

    handleClose = () => {
        this.setState({isDeleting: false});
    };

    render() {
        const { classes, assetsList, index, asset } = this.props;
        const { finalPrice, isEditingLocked, dataToDownload, isDeleting, isLoading } = this.state;
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
                        disabled={isEditingLocked && asset.hasOwnProperty('assetFinalPrice')}
                        variant="outlined"
                        margin="dense"
                        type="number"
                        inputProps={{
                            step: 0.01,
                        }}
                        className={classes.finalPriceField}
                    />
                    {isEditingLocked && asset.hasOwnProperty('assetFinalPrice')
                        ? (<Button onClick={this.handleEditFinalPrice} className={classes.finalPriceButton}>Editar</Button>)
                        : (<Button onClick={this.handleSetFinalPrice(asset)} className={classes.finalPriceButton}>Salvar</Button>)
                    }
                </TableCell>

                <TableCell align="center">
                    <IconButton
                        color="primary"
                        className={classes.button}
                        onClick={this.handleDownload(asset)}
                    >
                        <SaveAltIcon fontSize="small" />
                    </IconButton>
                    <CSVLink data={dataToDownload} ref={(r) => this.csvLink = r} filename={`${asset.assetName}.csv`}/>
                </TableCell>

                <TableCell align="center">
                    <IconButton color="secondary" className={classes.button} onClick={this.handleOpen}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </TableCell>

                <Dialog open={isDeleting} onClose={this.handleClose}>
                    <DialogTitle id="alert-dialog-title">Cuidado!</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Você está prestes a apagar o ativo {asset.assetName}.
                            Tal ação é irreversivel e deixará o histórico de preços e posições individuais relativas ao ativo inacessíveis.
                            Clique em "Apagar" somente se tiver certeza de que está ciente das consequências.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        {isLoading && <CircularProgress/>}
                        <Button onClick={this.handleClose} color="primary" disabled={isLoading} autoFocus>
                            Cancelar
                        </Button>
                        <Button onClick={this.handleDelete(asset)} color="secondary" disabled={isLoading}>
                            Apagar
                        </Button>
                    </DialogActions>
                </Dialog>

            </TableRow>
        );
    }
}

const mapStateToProps = state => {
    return {
        usersList: state.firestore.ordered.usersList || []
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