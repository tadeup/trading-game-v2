import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firestoreConnect, firebaseConnect } from 'react-redux-firebase'
import { actionTypes } from "redux-firestore";
import CssBaseline from "@material-ui/core/es/CssBaseline/CssBaseline";
import {Paper, withStyles} from "@material-ui/core";

export const styles = theme => ({
    main: {
        minWidth: 350,
        minHeight: 250
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
                self offers list
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