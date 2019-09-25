import React from 'react';
import {CircularProgress, Grid, makeStyles} from "@material-ui/core";


const useStyles = makeStyles(theme => ({
    grid: {
        height: '98vh',
    },
    progress: {
        margin: theme.spacing(2),
    },
}));

const Loader = () => {
    const classes = useStyles();

    return (
        <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            className={classes.grid}
        >
            <CircularProgress className={classes.progress}/>
        </Grid>
    );
};

export default Loader;