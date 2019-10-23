import React, {Component} from 'react';
import { connect } from 'react-redux'
import { compose } from 'redux'
import {firestoreConnect, isLoaded} from 'react-redux-firebase'
import CssBaseline from "@material-ui/core/es/CssBaseline/CssBaseline";
import {GridList, withStyles } from "@material-ui/core";
import Skeleton from '@material-ui/lab/Skeleton';
import { selectAsset } from "./redux/actions";
import StockListItem from "./StockListItem";

export const styles = theme => ({
    gridList: {
        minHeight: 646,
        height: '85vh',
        borderBottom: '1px solid rgba(224, 224, 224, 1)'
    },
    itemFirst: {
        textAlign: 'start',
    },
    tableActivity: {
        border: '1px solid rgba(224, 224, 224, 1)'
    },
    tableBook: {
        border: '1px solid rgba(224, 224, 224, 1)'
    },
    buttonElement: {
        backgroundColor: '#FFF',
        margin: '2px 3px 8px 4px',
        padding: 0,
        boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.12)'
    },
    buttonGridContainer: {
        marginLeft: 8,
        marginRight: 0
    },
    tableHeader: {
        paddingLeft: 8,
        whiteSpace: 'nowrap'
    },
    timestamp: {
        color: 'rgb(153, 153, 153)'
    },
    lastPricesUp: {
        color: 'rgb(234, 0, 112)',
    },
    lastPricesDown: {
        color: 'rgb(112, 168, 0)',
    }
});

// STATEFUL
class StocksList extends Component {
    state = {  };

    render() {
        const { classes, assets, profile } = this.props;
        return (
            <>
                <CssBaseline/>
                <GridList cellHeight={140} className={classes.gridList} cols={1}>
                    {assets && isLoaded(profile) ? assets.map((asset, index)=>(
                        <StockListItem asset={asset} profile={profile} key={index}/>
                    )) : [1,2,3].map(el=><Skeleton height={140} key={el}/>)}
                </GridList>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        assets: state.firestore.ordered.assets,
        profile: state.firebase.profile,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        selectAsset: payload => dispatch(selectAsset(payload)),
    }
};

export default compose(
    withStyles(styles),
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect((props) => {
        return [
            {
                collection: 'assets',
                where: [
                    ['assetIsActive', '==', true],
                ],
            }
        ]
    }),
)(StocksList)