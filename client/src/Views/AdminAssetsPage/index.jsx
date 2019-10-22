import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux'
import {compose} from 'redux'
import {firestoreConnect} from 'react-redux-firebase'
import {actionTypes} from "redux-firestore";
import CssBaseline from "@material-ui/core/es/CssBaseline/CssBaseline";
import {withStyles} from "@material-ui/core";
import {styles} from "./styles";
import Grid from "@material-ui/core/Grid";
import NewAsset from "../../Components/NewAsset";
import AssetsList from "../../Components/AdminAssetsList";

// STATELESS
const AdminAssetsPage = (props) => {
    return (
        <>
            <CssBaseline/>
            <Grid
                container
                direction="row"
                justify="center"
                alignItems="flex-start"
                spacing={2}
            >
                <Grid item xs={2}>
                    <NewAsset/>
                </Grid>
                <Grid item xs={10}>
                    <AssetsList/>
                </Grid>
            </Grid>
        </>
    );
};

const mapStateToProps = state => {
    return {}
};

const mapDispatchToProps = dispatch => {
    return {}
};

export default compose(
    withStyles(styles),
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect(),
)(AdminAssetsPage)