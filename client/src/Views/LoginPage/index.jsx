import React, {Component} from 'react';
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firestoreConnect, firebaseConnect, isEmpty, isLoaded  } from 'react-redux-firebase'
import { actionTypes } from "redux-firestore";
import CssBaseline from "@material-ui/core/es/CssBaseline/CssBaseline";
import {Container, Paper, TextField, Grid, Typography, withStyles, Snackbar} from "@material-ui/core";
import { styles } from "./styles";
import Button from "@material-ui/core/Button";
import {Redirect} from "react-router-dom";
import Loader from "../../Components/Loader";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from '@material-ui/icons/Close'

// STATEFUL
class LoginPage extends Component {
    state = {
        email: '',
        pw: '',
        snackbarOpen: false,
    };

    handleLogin = () => {
        this.props.firebase.login({
            email: this.state.email,
            password: this.state.pw
        })
            .catch(err => {
                this.setState({snackbarOpen: true})
            });
    };

    handleChange = name => event => {
        this.setState({ [name]: event.target.value });
    };

    handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({snackbarOpen: false});
    };

    render() {
        const { classes, auth } = this.props;
        const { email, pw, snackbarOpen } = this.state;

        if (!isLoaded(auth)) {
            return <Loader/>
        }

        if (!isEmpty(auth)) {
            return <Redirect exact to={'/trade'}/>
        }

        return (
            <>
                <CssBaseline/>
                <Container component="main" maxWidth="xs" className={classes.main}>
                    <Paper className={classes.paper}>
                        <Grid
                            container
                            direction="column"
                            justify="center"
                            alignItems="center"
                        >
                            <Typography variant="h4">
                                Trading Game
                            </Typography>
                            <Typography variant="h6" gutterBottom>
                                subtitulo vai aqui
                            </Typography>
                            <TextField
                                id="outlined-email-input"
                                label="Email"
                                className={classes.textField}
                                type="email"
                                name="email"
                                autoComplete="email"
                                margin="normal"
                                variant="outlined"
                                fullWidth={true}
                                value={email}
                                onChange={this.handleChange('email')}
                            />
                            <TextField
                                id="outlined-password-input"
                                label="Senha"
                                className={classes.textField}
                                type="password"
                                autoComplete="current-password"
                                margin="normal"
                                variant="outlined"
                                fullWidth={true}
                                value={pw}
                                onChange={this.handleChange('pw')}
                            />
                            <Button variant="contained" color="primary" className={classes.button} fullWidth={true} onClick={this.handleLogin}>
                                ENTRAR
                            </Button>
                        </Grid>
                    </Paper>
                </Container>

                <Snackbar
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                    open={snackbarOpen}
                    autoHideDuration={6000}
                    onClose={this.handleCloseSnackbar}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">Email ou senha inválidos!</span>}
                    action={[
                        <IconButton
                            key="close"
                            aria-label="close"
                            color="inherit"
                            className={classes.close}
                            onClick={this.handleCloseSnackbar}
                        >
                            <CloseIcon />
                        </IconButton>
                    ]}
                />
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        auth: state.firebase.auth
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
)(LoginPage)