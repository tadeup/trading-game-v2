import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase'
import { actionTypes } from "redux-firestore";
import CssBaseline from "@material-ui/core/es/CssBaseline/CssBaseline";
import { withStyles } from "@material-ui/core";
import { styles } from "./styles";
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
            direction="column"
            justify="center"
            alignItems="center"
            spacing={2}
        >
          <Grid item xs={12}>
            <NewAsset/>
          </Grid>
      </Grid>
        <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
        >
          <Grid item xs={12}>
            <AssetsList/>
          </Grid>

        </Grid>

    </>
  );
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
)(AdminAssetsPage)