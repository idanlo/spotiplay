import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Divider } from '@material-ui/core';

const NotFound = () => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    flex={1}
  >
    <Typography color="secondary" variant="h1" style={{ fontWeight: '800' }}>
      404 Not Found
    </Typography>
    <Divider />
    <Typography color="secondary" variant="h3" style={{ fontWeight: '700' }}>
      Click <Link to="/">here</Link> to go to the home page.
    </Typography>
  </Box>
);

export default NotFound;
