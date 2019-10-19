import React, {Component} from 'react';
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase'
import CssBaseline from "@material-ui/core/es/CssBaseline/CssBaseline";
import {Paper, withStyles} from "@material-ui/core";

export const styles = theme => ({

});

// STATEFUL
class SelfAssets extends Component {
    state = {

    };

    render() {
        const { classes } = this.props;
        const {  } = this.state;
        return (
            <Paper className={classes.main}>
                <CssBaseline/>

1
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

    }
};

export default compose(
    withStyles(styles),
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect(),
)(SelfAssets)