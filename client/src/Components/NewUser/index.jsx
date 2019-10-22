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
        name: '',
        pw: '',
        isSending: false
    };

    handleChange = name => event => {
        this.setState({[name]: event.target.value});
    };

    handleSubmit = (event) => {
        if (this.state.email && this.state.pw) {
            this.setState({ isSending: true }, () => {
                const newUser = this.props.firebase.functions().httpsCallable('newUser');
                newUser({
                    email: this.state.email,
                    name: this.state.name,
                    password: this.state.pw,
                    isAdmin: false,
                    positions: Object.assign({}, ...this.props.assetsList.map(asset=>({[asset.assetName]: {open: 0, closed: 0}})))
                }).then((res)=>{
                    console.log(res);
                    if (res.data && res.data.success) {
                        this.setState({
                            email: '',
                            name: '',
                            pw: '',
                            isSending: false
                        })
                    } else {
                        this.setState({
                            isSending: false
                        })
                    }
                })
            });
        } else {
            console.log('erro: sem dados necessarios')
        }
    };

    render() {
        const { classes, assetsList } = this.props;
        const { email, name, pw, isSending } = this.state;
        return (
            <Paper className={classes.paper}>
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
                        label="Nome (Opcional)"
                        className={classes.textField}
                        value={name}
                        onChange={this.handleChange('name')}
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
                    <Button variant="contained" className={classes.button} onClick={this.handleSubmit} disabled={isSending}>
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