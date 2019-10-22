import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux'
import {compose} from 'redux'
import {firestoreConnect, firebaseConnect} from 'react-redux-firebase'
import {actionTypes} from "redux-firestore";
import CssBaseline from "@material-ui/core/es/CssBaseline/CssBaseline";
import {Grid, Paper, TextField, Typography, withStyles} from "@material-ui/core";
import Button from "@material-ui/core/Button";

export const styles = theme => ({
    paper: {
        padding: 12
    }
});

// STATEFUL
class NewUser extends Component {
    state = {
        email: '',
        pw: ''
    };

    handleChange = name => event => {
        this.setState({[name]: event.target.value});
    };

    handleSubmit = (event) => {
        this.props.firebase.createUser({
            email: this.state.email,
            password: this.state.pw
        }, {
            email: this.state.email,
            isAdmin: false,
            positions: {

            }
        }).then(() => {
            this.setState({
                email: '',
                pw: ''
            })
        });
    };

    render() {
        const { classes, assetsList } = this.props;
        const { email, pw } = this.state;
        return (
            <Paper className={classes.paper}> {console.log(assetsList)}
                <CssBaseline/>
                <Grid
                    container
                    direction="column"
                    justify="flex-start"
                    alignItems="center"
                >
                    <Typography variant="h5">Novo Usuário</Typography>
                    <TextField
                        label="email"
                        className={classes.textField}
                        value={email}
                        onChange={this.handleChange('email')}
                        margin="normal"
                        variant="outlined"
                        fullWidth={true}
                    />
                    <TextField
                        label="senha"
                        className={classes.textField}
                        value={pw}
                        onChange={this.handleChange('pw')}
                        margin="normal"
                        variant="outlined"
                        fullWidth={true}
                    />
                    <Button variant="contained" className={classes.button} onClick={this.handleSubmit}>
                        Enviar
                    </Button>
                </Grid>
            </Paper>
        );
    }
}

const mapStateToProps = state => {
    return {
        assetsList: state.firestore.ordered.assetsList || []
    }
};

const mapDispatchToProps = dispatch => {
    return {}
};

export default compose(
    withStyles(styles),
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect(),
)(NewUser)