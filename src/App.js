import React from 'react';
import Layout from './Containers/Layout/Layout';
import {
  MuiThemeProvider,
  createMuiTheme,
  makeStyles,
} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline/CssBaseline';

import 'react-virtualized/styles.css';

// Override global material item md={2} size to be 1.2 instead of 2 which makes it possible to have a 10 column row, which
// isn't currently supported in Material-UI
const useStyles = makeStyles({
  '@global': {
    '.MuiGrid-grid-md-2': {
      maxWidth: '10%',
      flexBasis: '10%',
    },
  },
});

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      light: '#757ce8',
      main: '#1db954',
      dark: '#191414',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#ffffff',
      dark: '#191414',
      contrastText: '#000',
    },
  },
  typography: {
    useNextVariants: true,
    fontFamily:
      'spotify,Helvetica Neue,Helvetica,Arial,Hiragino Kaku Gothic Pro,Meiryo,MS Gothic,sans-serif',
    // 'spotify, "Proxima Nova",spotify-circular,spotify-circular-cyrillic,spotify-circular-arabic,spotify-circular-hebrew,Helvetica Neue,Helvetica,Arial,Hiragino Kaku Gothic Pro,Meiryo,MS Gothic,sans-serif',
  },
});

const App = () => {
  useStyles();

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline>
        <Layout
          style={
            {
              // fontFamily:
              //   'Montserrat,Helvetica Neue,Helvetica,Arial,Hiragino Kaku Gothic Pro,Meiryo,MS Gothic,sans-serif',
              // fontFamily:
              //   'spotify-circular,spotify-circular-cyrillic,spotify-circular-arabic,spotify-circular-hebrew,Helvetica Neue,Helvetica,Arial,Hiragino Kaku Gothic Pro,Meiryo,MS Gothic,sans-serif',
            }
          }
        />
      </CssBaseline>
    </MuiThemeProvider>
  );
};

export default App;
