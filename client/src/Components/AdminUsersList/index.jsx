import React, {Component} from 'react';
import {connect} from 'react-redux'
import {compose} from 'redux'
import {firestoreConnect} from 'react-redux-firebase'
import {actionTypes} from "redux-firestore";
import CssBaseline from "@material-ui/core/es/CssBaseline/CssBaseline";
import {Table, withStyles} from "@material-ui/core";
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
import {CSVLink} from "react-csv";

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
                openBuy: position[1].openBuy,
                openSell: position[1].openSell,
                closed: position[1].closed,
                result: finalPosition
            })
        });
        this.setState({ dataToDownload }, () => {
            this.csvLink.link.click()
        })
    };

    handleDownloadUsers = usersList => event => {
        const dataToDownload = usersList.map(user => {
            return ({
                ID: user.id,
                name: user.name,
            })
        });
        this.setState({ dataToDownload }, () => {
            this.csvLinkAllUsers.link.click()
        })
    };

    handleDownloadResults = usersList => event => {
        const dataToDownload = usersList.map(user => {

            const userData = {
                ID: user.id,
                name: user.name,
            };

            Object.entries(user.positions).forEach(position => {
                const avgBuyPrice = position[1].buyQuantity ? position[1].avgBuyPrice / position[1].buyQuantity : 0;
                const avgSellPrice = position[1].sellQuantity ? position[1].avgSellPrice / position[1].sellQuantity : 0;
                const finalPrice = this.props.assetsList.filter(el => el.assetName === position[0])[0];

                userData[`${position[0]}_result`] = finalPrice && finalPrice.hasOwnProperty('assetFinalPrice')
                  ? ((avgSellPrice - finalPrice.assetFinalPrice) * position[1].sellQuantity - (avgBuyPrice - finalPrice.assetFinalPrice) * position[1].buyQuantity).toFixed(2)
                  : 'Indisponível';
                userData[`${position[0]}_open_buy`] = position[1].openBuy
                userData[`${position[0]}_open_sell`] = position[1].openSell
                userData[`${position[0]}_closed`] = position[1].closed
            });

            return userData;
        });
        this.setState({ dataToDownload }, () => {
            this.csvLinkResults.link.click()
        })
    };

    handleDownloadVolume = usersList => event => {
        const dataToDownload = usersList.map(user => {

            const userData = {
                ID: user.id,
                name: user.name,
            };

            Object.entries(user.positions).forEach(position => {
                userData[position[0]] = position[1].buyQuantity + position[1].sellQuantity
            })

            return this.props.firestore.get({
                collection: 'transactions',
                where: [
                    ['buyer', '==', user.id],
                    ['seller', '==', user.id],
                ],
            })
              .then(data=> {
                  data.docs.forEach(doc=> {
                      const data = doc.data()
                      userData[data['asset']] -= 2 * data['quantity']
                  });

                  return userData;
            });
        })

        Promise.all(dataToDownload).then(res => {
            this.setState({ dataToDownload: res }, () => {
                this.csvLink.link.click()
            })
        })
    };

    render() {
        const { classes, usersList } = this.props;
        const { dataToDownload } = this.state;
        return (
            <>
                <CssBaseline/>
                <CSVLink data={dataToDownload} ref={(r) => this.csvLinkAllUsers = r} filename={`users_list.csv`}/>
                <CSVLink data={dataToDownload} ref={(r) => this.csvLinkResults = r} filename={`results_data.csv`}/>
                <CSVLink data={dataToDownload} ref={(r) => this.csvLink = r} filename={`user_data.csv`}/>

                <Button style={{marginBottom:6}} variant="outlined" fullWidth onClick={this.handleDownloadUsers(usersList)}>Baixar lista de usuários</Button>
                <Button style={{marginBottom:6}} variant="outlined" fullWidth onClick={this.handleDownloadResults(usersList)}>Baixar lista de resultados</Button>
                <Button style={{marginBottom:16}} variant="outlined" fullWidth onClick={this.handleDownloadVolume(usersList)}>Baixar volume por usuário</Button>

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
                                        <TableCell align="center">Posição Aberta Buy</TableCell>
                                        <TableCell align="center">Posição Aberta Sell</TableCell>
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
                                                <TableCell align="center">{position[1].openBuy}</TableCell>
                                                <TableCell align="center">{position[1].openSell}</TableCell>
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
                            {/*<CSVLink data={dataToDownload} ref={(r) => this.csvLink = r} filename={`user_${user.name}.csv`}/>*/}

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