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
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from "@material-ui/core/Typography";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import { CSVLink } from "react-csv";
import moment from "moment";

export const styles = theme => ({
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
    idHeading: {
        marginLeft: 'auto',
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
        minWidth: 300
    }
});

// STATEFUL
class UsersList extends Component {
    state = {
        dataToDownload: []
    };

    handleDownload = user => event => {
        const dataToDownload = Object.entries(user.positions).map(position => {
            const avgBuyPrice = position[1].buyQuantity ? position[1].avgBuyPrice / position[1].buyQuantity : 0;
            const avgSellPrice = position[1].sellQuantity ? position[1].avgSellPrice / position[1].sellQuantity : 0;
            const finalPrice = this.props.assetsList.filter(el => el.assetName === position[0])[0];
            const finalPosition = finalPrice && finalPrice.hasOwnProperty('assetFinalPrice')
                ? ((avgSellPrice - finalPrice.assetFinalPrice) * position[1].sellQuantity - (avgBuyPrice - finalPrice.assetFinalPrice) * position[1].buyQuantity).toFixed(2)
                : 'Indisponível';

            return ({
                asset: position[0],
                open: position[1].open,
                closed: position[1].closed,
                result: finalPosition
            })
        });
        this.setState({ dataToDownload }, () => {
            this.csvLink.link.click()
        })
    };

    render() {
        const { classes, usersList } = this.props;
        const { dataToDownload } = this.state;
        return (
            <>
                <CssBaseline/>

                {usersList.map((user, index) => (
                    <ExpansionPanel key={index}>
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography className={classes.heading}>{user.name}</Typography>
                            <Typography className={classes.secondaryHeading}>{user.email}</Typography>
                            <Typography className={classes.idHeading}>{user.id}</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">Ativo</TableCell>
                                        <TableCell align="center">Posição Aberta</TableCell>
                                        <TableCell align="center">Posição Fechada</TableCell>
                                        <TableCell align="center">Resultado</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Object.entries(user.positions).map((position, index) => {
                                        const avgBuyPrice = position[1].buyQuantity ? position[1].avgBuyPrice / position[1].buyQuantity : 0;
                                        const avgSellPrice = position[1].sellQuantity ? position[1].avgSellPrice / position[1].sellQuantity : 0;
                                        const finalPrice = this.props.assetsList.filter(el => el.assetName === position[0])[0];
                                        const finalPosition = finalPrice && finalPrice.hasOwnProperty('assetFinalPrice')
                                            ? ((avgSellPrice - finalPrice.assetFinalPrice) * position[1].sellQuantity - (avgBuyPrice - finalPrice.assetFinalPrice) * position[1].buyQuantity).toFixed(2)
                                            : 'Indisponível';
                                        return (
                                            <TableRow key={index}>
                                                <TableCell align="center">{position[0]}</TableCell>
                                                <TableCell align="center">{position[1].open}</TableCell>
                                                <TableCell align="center">{position[1].closed}</TableCell>
                                                <TableCell align="center">{finalPosition}</TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </ExpansionPanelDetails>

                        <Divider />

                        <ExpansionPanelActions>
                            <Button size="small" onClick={this.handleDownload(user)}>Download</Button>
                            <CSVLink data={dataToDownload} ref={(r) => this.csvLink = r} filename={`user_${user.name}.csv`}/>

                            <Button size="small" color="primary" disabled={true}>Editar</Button>
                        </ExpansionPanelActions>
                    </ExpansionPanel>
                ))}
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        usersList: state.firestore.ordered.usersList || [],
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
    firestoreConnect(),
)(UsersList)