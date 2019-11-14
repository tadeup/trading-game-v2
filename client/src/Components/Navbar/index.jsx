import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import {connect} from "react-redux";
import {firestoreConnect} from "react-redux-firebase";
import {compose} from "redux";
import {actionTypes} from "redux-firestore";
import {Link} from "react-router-dom";

const styles = theme => ({
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        // background: "linear-gradient(175deg, #121212e6 0%, #050505c7 55%)",
        background: 'linear-gradient(175deg, #10111de6 0%, #001c47db 70%)',
        color: 'rgba(255, 255, 255, 0.97)',
        paddingLeft: 10
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        letterSpacing: '0.2em'
    },
});

class Navbar extends Component {
    state = {
        anchorEl: null
    };

    handleOpen = event => {
        this.setState({anchorEl: event.currentTarget})
    };

    handleClose = () => {
        this.setState({anchorEl: null})
    };

    handleLogout = () => {
        this.props.firebase.logout()
    };

    render() {
        const { classes, profile } = this.props;
        const { anchorEl } = this.state;

        return (
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        Trading Game
                    </Typography>
                    <div>
                        <IconButton
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={this.handleOpen}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            getContentAnchorEl={null}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={this.handleClose}
                        >
                            <MenuItem component={Link} to={'/trade/profile'}>Profile</MenuItem>
                            <MenuItem component={Link} to={'/trade'}>Trade</MenuItem>
                            {profile.isAdmin && <MenuItem component={Link} to={'/admin'}>Ativos</MenuItem>}
                            {profile.isAdmin && <MenuItem component={Link} to={'/admin/users'}>Usuarios</MenuItem>}
                            <MenuItem onClick={this.handleLogout}>Log Out</MenuItem>
                        </Menu>
                    </div>
                </Toolbar>
            </AppBar>
        );
    }
}

const mapStateToProps = state => {
    return {
        profile: state.firebase.profile
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
)(Navbar)