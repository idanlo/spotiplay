import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Typography, Divider } from '@material-ui/core';

const NotFound = () => (
    <Grid container direction="column" alignItems="center">
        <Typography color="secondary" variant="h1">
            404 Not Found
        </Typography>
        <Divider />
        <Typography color="secondary" variant="h3">
            Click <Link to="/browse/featured">here</Link> to go to the home
            page.
        </Typography>
    </Grid>
);

export default NotFound;
