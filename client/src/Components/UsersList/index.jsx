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
                    <ExpansionPanel>
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
                                        <TableCell align="center">Posição</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Object.entries(user.positions).map((position, index) => (
                                        <TableRow key={index}>
                                            <TableCell align="center">{position[0]}</TableCell>
                                            <TableCell align="center">{position[1].closed}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                ))}


                {/*<Table>*/}
                {/*    <TableHead>*/}
                {/*        <TableRow>{console.log(usersList)}*/}
                {/*            <TableCell align="center">Email</TableCell>*/}
                {/*            <TableCell align="center">ID</TableCell>*/}
                {/*            <TableCell align="center">Admin</TableCell>*/}
                {/*            <TableCell align="center">Preço Final</TableCell>*/}
                {/*            <TableCell align="center">Apagar</TableCell>*/}
                {/*        </TableRow>*/}
                {/*    </TableHead>*/}
                {/*    <TableBody>*/}
                {/*        {usersList.map((user, index) => (*/}
                {/*            <TableRow key={index}>*/}
                {/*                <TableCell align="center">{user.email}</TableCell>*/}
                {/*                <TableCell align="center">{user.id}</TableCell>*/}
                {/*                <TableCell align="center">{user.isAdmin ? 'Ativo' : 'Inativo'}</TableCell>*/}
                {/*                <TableCell align="center"><TextField/></TableCell>*/}
                {/*                <TableCell align="center">x</TableCell>*/}
                {/*            </TableRow>*/}
                {/*        ))}*/}
                {/*    </TableBody>*/}
                {/*</Table>*/}
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
    firestoreConnect((props) => {
        return [
            {
                collection: 'users',
                storeAs: 'usersList'
            },
        ]
    }),
)(UsersList)