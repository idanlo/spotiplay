import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { SpotifyApiContext, SpotifyApiAxiosContext } from 'react-spotify-api';
import styled from 'styled-components';
import axios from 'axios';
import * as actionTypes from '../../store/actions/actionTypes';
import HomePage from '../../Components/HomePage/HomePage';
import MusicPlayer from '../../Components/MusicPlayer/MusicPlayer';
import Login from '../../Components/Login/Login';
import Sidedrawer from '../../Components/Sidedrawer/Sidedrawer';
import PlaylistView from '../../Components/PlaylistView/PlaylistView';
import { withWidth, Grid, CircularProgress } from '@material-ui/core';
import Search from '../../Components/Search/Search';
import NotFound from '../../Components/NotFound/NotFound';
import AlbumView from '../../Components/AlbumView/AlbumView';
import Library from '../../Components/Library/Library';
import ArtistView from '../../Components/ArtistView/ArtistView';
import GenreView from '../../Components/GenreView/GenreView';
import { logger } from '../../utils';

// const Search = React.lazy(() => import('../../Components/Search/Search'));
// const NotFound = React.lazy(() => import('../../Components/NotFound/NotFound'));
// const AlbumView = React.lazy(() =>
//     import('../../Components/AlbumView/AlbumView')
// );
// const Library = React.lazy(() => import('../../Components/Library/Library'));
// const ArtistView = React.lazy(() =>
//     import('../../Components/ArtistView/ArtistView')
// );
// const GenreView = React.lazy(() =>
//     import('../../Components/GenreView/GenreView')
// );

const GridSidedrawer = styled(Grid)`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
`;

const GridHomePage = styled(Grid)`
  padding-bottom: 100px;
  width: 100%;
`;

const Background = styled.div`
  background-image: ${props => props.background};
  width: 100%;
  height: 100vh;
  background-size: cover;
  background-repeat: no-repeat;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1000;
`;

class Layout extends Component {
  state = {
    sideDrawerOpen: false,
    loading: true,
  };

  componentDidMount() {
    axios.interceptors.response.use(
      response => {
        return response;
      },
      error => {
        const originalRequest = error.config;
        if (error?.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          logger.log('401 Error happened, axios interceptor catched');
          // acquire refresh token from localStorage
          const refresh_token = localStorage.getItem(
            'react-spotify-refresh-token'
          );
          if (refresh_token) {
            return axios
              .post('https://spotiplay-backend.herokuapp.com/refresh', {
                data: JSON.stringify({
                  refresh_token,
                }),
              })
              .then(res => {
                if (res.status === 200) {
                  const { access_token } = res.data;
                  // put access token in localStorage
                  localStorage.setItem(
                    'react-spotify-access-token',
                    access_token
                  );
                  axios.defaults.headers[
                    'Authorization'
                  ] = `Bearer ${access_token}`;
                  // update the headers for the original request with the new access token in the Authorization header
                  originalRequest.headers[
                    'Authorization'
                  ] = `Bearer ${access_token}`;
                  // update the user access token in redux store
                  this.props.setUser({ access_token });

                  // return the originalRequest object with Axios.
                  return axios(originalRequest);
                }
              });
          } else {
            // If the user is in the initial loading - set loading to false and let the user login with Spotify
            if (this.state.loading) {
              this.setState({ loading: false });
            } else {
              // if the user is not in the initial loading state, and doesn't have a refresh token in the local storage
              // (something that shouldn't happen) then reload the page
              return window.location.reload();
            }
          }
        }
        return error;
        // return axios(originalRequest);
      }
    );

    let params = this.getHashParams();
    logger.log('Params', params);
    // If access token doesn't exist in has params, try to take it from local storage
    if (!('access_token' in params)) {
      const currentAccessToken = localStorage.getItem(
        'react-spotify-access-token'
      );

      if (currentAccessToken) {
        params.access_token = currentAccessToken;
      }
    }
    logger.log('Params after', params);
    if ('access_token' in params) {
      axios
        .get('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: `Bearer ${params.access_token}`,
          },
        })
        .then(({ data }) => {
          localStorage.setItem(
            'react-spotify-access-token',
            params.access_token
          );

          axios.defaults.headers[
            'Authorization'
          ] = `Bearer ${params.access_token}`;

          if (params.refresh_token) {
            localStorage.setItem(
              'react-spotify-refresh-token',
              params.refresh_token
            );
          }

          let newUser = {
            access_token: params.access_token,
            displayName: data.display_name,
            email: data.email,
            id: data.id,
            type: data.type,
            country: data.country,
            product: data.product,
          };
          this.logInUserAndGetInfo(newUser);
          // If this fails then the user will still see the login page, that means the Layout page will 100% have the recently played tracks
          axios({
            url: 'https://api.spotify.com/v1/me/player/recently-played',
            method: 'GET',
            params: {
              limit: 12,
            },
          }).then(res => {
            logger.log(res);
            this.props.setRecentlyPlayed(res.data.items);
            this.setState({ loading: false });
          });
        });
      // no need to catch this, if there is a 401 error the axios interceptor will handle it
    } else {
      // The user is shown a 'login with Spotify button'
      this.setState({ loading: false });
    }
  }

  logInUserAndGetInfo = newUser => {
    logger.log('LOG IN', newUser);
    this.props.setUser(newUser); // set user in redux state
    if (this.props.location.pathname === '/') {
      this.props.history.push('/browse/featured'); // if there is no page the user wants to go to
      // then go to the home page
    } else {
      // if there is a page the user wants to go to then just send them there
      this.props.history.push();
    }
  };

  getHashParams() {
    var hashParams = {};
    var e,
      r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    while ((e = r.exec(q))) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  toggleDrawerHandler = () => {
    let mode = this.state.sideDrawerOpen;
    this.setState({ sideDrawerOpen: !mode });
  };

  render() {
    let drawer =
      this.props.width === 'lg' || this.props.width === 'xl' ? (
        <Sidedrawer />
      ) : (
        <Sidedrawer
          open={this.state.sideDrawerOpen}
          toggleDrawer={this.toggleDrawerHandler}
        />
      );

    return this.state.loading ? (
      <Grid
        container
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Grid>
    ) : this.props.user ? (
      <SpotifyApiAxiosContext.Provider value={axios}>
        <SpotifyApiContext.Provider value={this.props.user.access_token}>
          <Background background={this.props.backgroundImage} />
          <Grid container>
            <GridSidedrawer item lg={2}>
              {drawer}
            </GridSidedrawer>
            <GridHomePage
              item
              lg={12}
              style={{
                paddingLeft:
                  this.props.width === 'lg' || this.props.width === 'xl'
                    ? 255
                    : null,
              }}
            >
              <Switch>
                <Route path="/browse/:item" exact component={HomePage} />
                <Route path="/search" exact component={Search} />

                <Route path="/search/:item/:query" exact component={Search} />

                <Route path="/playlist/:id" exact component={PlaylistView} />

                <Route path="/album/:id" exact component={AlbumView} />

                <Route path="/genre/:id" component={GenreView} />
                <Route path="/artist/:id" exact component={ArtistView} />
                <Route path="/library/:item" exact component={Library} />
                <Route component={NotFound} />
              </Switch>
            </GridHomePage>
          </Grid>
          <MusicPlayer />
        </SpotifyApiContext.Provider>
      </SpotifyApiAxiosContext.Provider>
    ) : (
      <Switch>
        <Route component={Login} />
      </Switch>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.current_user,
    backgroundImage: state.backgroundImage,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setUser: user => dispatch({ type: actionTypes.SET_USER, user }),
    setRecentlyPlayed: recentlyPlayed =>
      dispatch(actionTypes.setRecentlyPlayed(recentlyPlayed)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withWidth()(Layout))
);
