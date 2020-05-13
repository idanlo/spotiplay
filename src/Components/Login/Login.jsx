import React from 'react';
import { Button, Typography, SvgIcon, Box } from '@material-ui/core';
import { ReactComponent as SpotifyIcon } from '../../icons/spotify.svg';

const Login = () => (
  <Box
    display="flex"
    flex={1}
    width="100vw"
    height="100vh"
    justifyContent="center"
    alignItems="center"
  >
    <Box display="flex" flexDirection="column">
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        marginBottom={'20px'}
      >
        <SvgIcon style={{ fontSize: 72 }}>
          <SpotifyIcon fill="#fff" />
        </SvgIcon>

        <Typography
          style={{ marginLeft: 10, fontWeight: 'bold', fontSize: 72 }}
          variant="h1"
        >
          Spotiplay
        </Typography>
      </Box>
      <Button
        color="primary"
        variant="contained"
        onClick={() => {
          window.location.href =
            'https://spotiplay-backend.herokuapp.com/login';
        }}
      >
        Login with Spotify
      </Button>
    </Box>
  </Box>
);

export default Login;
