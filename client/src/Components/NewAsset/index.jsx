import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firestoreConnect, firebaseConnect } from 'react-redux-firebase'
import { actionTypes } from "redux-firestore";
import CssBaseline from "@material-ui/core/es/CssBaseline/CssBaseline";
import {Paper, TextField, withStyles} from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";

export const styles = theme => ({
    textField: {

    }
});

// STATEFUL
class NewAsset extends Component {
    state = {
        name: '',
        margin: 100,
        isContinuous: false,
        isSending: false
    };

    handleChange = name => event => {
        this.setState({ [name]: event.target.value });
    };

    handleChangeInt = name => event => {
        if (event.target.value) {
            this.setState({ [name]: parseInt(event.target.value) });
        } else {
            this.setState({ [name]: 0 });
        }
    };

    handleCheck = name => event => {
        this.setState({ [name]: event.target.checked });
    };

    handleSubmit = event => {
        this.setState({ isSending: true }, () => {
            this.props.firestore.add(
                { collection: 'assets'},
                {
                    assetName: this.state.name,
                    assetMargin: this.state.margin,
                    assetIsContinuous: this.state.isContinuous,
                    assetIsActive: true,
                }
            ).then(()=>{
                this.setState({ isSending: false })
            })
        });

    };

    render() {
        const { classes }= this.props;
        const { name, margin, isContinuous, isSending } = this.state;
        return (
            <Paper>
                <CssBaseline/>
                <TextField
                    label="Nome do Ativo"
                    className={classes.textField}
                    value={name}
                    onChange={this.handleChange('name')}
                    margin="normal"
                    variant="outlined"
                />
                <TextField
                    label="Margem"
                    className={classes.textField}
                    value={margin}
                    onChange={this.handleChangeInt('margin')}
                    margin="normal"
                    variant="outlined"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={isContinuous}
                            onChange={this.handleCheck('isContinuous')}
                            value="checkedA"
                        />
                    }
                    label="Trade Continuo"
                />
                <Button variant="contained" className={classes.button} onClick={this.handleSubmit} disabled={isSending}>
                    Adicionar
                </Button>
            </Paper>
        );
    }
}

const mapStateToProps = state => {
    return {

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
    firestoreConnect(),
)(NewAsset)