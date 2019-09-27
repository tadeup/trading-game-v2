import React, {Component} from 'react';
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firestoreConnect, firebaseConnect } from 'react-redux-firebase'
import { actionTypes } from "redux-firestore";
import CssBaseline from "@material-ui/core/es/CssBaseline/CssBaseline";
import { withStyles } from "@material-ui/core";
import { styles } from "./styles";
import Book from "../../Components/Book";
import NewOrder from "../../Components/NewOrder";
import StocksList from "../../Components/StocksList";
import Grid from "@material-ui/core/Grid";
import SelfLastOrders from "../../Components/SelfLastOrders";

// STATEFUL
class TradePage extends Component {
    state = {  };

    render() {
        const { classes } = this.props;
        return (
            <>
                <CssBaseline/>
                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="stretch"
                    spacing={4}
                >
                    <Grid item xs={3}>
                        <Grid
                            container
                            direction="column"
                            justify="space-between"
                            alignItems="center"
                            className={classes.containerStretch}
                        >
                            <NewOrder/>
                            <SelfLastOrders/>
                        </Grid>
                    </Grid>
                    <Grid item xs={3}>
                        <Book/>
                    </Grid>
                    <Grid item xs={6}>
                        <StocksList/>
                    </Grid>
                </Grid>
            </>
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
)(TradePage)