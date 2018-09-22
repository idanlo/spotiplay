import React from "react";
import { Grid, Typography } from "@material-ui/core";

const Login = () => (
    <Grid container>
        <Grid item style={{ margin: "0 auto" }}>
            {/* <a
                href="http://spotify-test-backend.herokuapp.com/login"
                style={{ textDecoration: "none" }}
            > */}
            {/* prod */}
            <a
                href="http://localhost:8888/login"
                style={{ textDecoration: "none" }}
            >
                <Typography variant="display4">Login with Spotify</Typography>
            </a>
        </Grid>
    </Grid>
);

export default Login;
