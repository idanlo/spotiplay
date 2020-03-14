import React from 'react';
import { Grid, Typography } from '@material-ui/core';

const Login = () => (
  <Grid container>
    <Grid item style={{ margin: '0 auto' }}>
      {/* <a
                href="http://spotify-test-backend.herokuapp.com/login"
                style={{ textDecoration: "none" }}
            > */}
      {/* prod */}
      <a
        style={{ textDecoration: 'none' }}
        href={'https://spotiplay-backend.herokuapp.com/login'}
      >
        <Typography variant="h1">Login with Spotify</Typography>
      </a>
    </Grid>
  </Grid>
);

export default Login;
