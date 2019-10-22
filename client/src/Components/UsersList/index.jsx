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
});

// STATEFUL
class UsersList extends Component {
    state = {

    };

    render() {
        const { classes, usersList } = this.props;
        const {  } = this.state;
        return (
            <>
                <CssBaseline/>

                {usersList.map((user, index) => (
                    <ExpansionPanel key={index}>{console.log(user)}
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography className={classes.heading}>{user.email}</Typography>
                            <Typography className={classes.secondaryHeading}>{user.id}</Typography>
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
                                    {Object.entries(user.positions).map((position, index) => (
                                        <TableRow key={index}>
                                            <TableCell align="center">{position[0]}</TableCell>
                                            <TableCell align="center">{position[1].open}</TableCell>
                                            <TableCell align="center">{position[1].closed}</TableCell>
                                            <TableCell align="center">---</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </ExpansionPanelDetails>

                        <Divider />

                        <ExpansionPanelActions>
                            <Button size="small" variant={'outlined'}>Download</Button>
                            <Button size="small" color="primary">Editar</Button>
                        </ExpansionPanelActions>
                    </ExpansionPanel>
                ))}
            </>
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
        clearFirestore: () => dispatch({ type: actionTypes.CLEAR_DATA })
    }
};

export default compose(
    withStyles(styles),
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect(),
)(UsersList)