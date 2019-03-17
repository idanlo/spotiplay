import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { SpotifyApiContext } from 'react-spotify-api';
import styled from 'styled-components';
import axios from 'axios';
import * as actionTypes from '../../store/actions/actionTypes';
import HomePage from '../../Components/HomePage/HomePage';
import MusicPlayer from '../../Components/MusicPlayer/MusicPlayer';
import Login from '../../Components/Login/Login';
import Sidedrawer from '../../Components/Sidedrawer/Sidedrawer';
import PlaylistView from '../../Components/PlaylistView/PlaylistView';
import { withWidth, Grid } from '@material-ui/core';
import Search from '../../Components/Search/Search';
import NotFound from '../../Components/NotFound/NotFound';
import AlbumView from '../../Components/AlbumView/AlbumView';
import Library from '../../Components/Library/Library';
import ArtistView from '../../Components/ArtistView/ArtistView';
import GenreView from '../../Components/GenreView/GenreView';

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

class Layout extends Component {
    state = {
        sideDrawerOpen: false,
        isOnMobile: false
    };

    isOnMobile = () => {
        var check = false;
        (function(a) {
            if (
                /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
                    a
                ) ||
                /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw(n|u)|c55\/|capi|ccwa|cdm|cell|chtm|cldc|cmd|co(mp|nd)|craw|da(it|ll|ng)|dbte|dcs|devi|dica|dmob|do(c|p)o|ds(12|d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(|_)|g1 u|g560|gene|gf5|gmo|go(\.w|od)|gr(ad|un)|haie|hcit|hd(m|p|t)|hei|hi(pt|ta)|hp( i|ip)|hsc|ht(c(| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i(20|go|ma)|i230|iac( ||\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|[a-w])|libw|lynx|m1w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|mcr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|([1-8]|c))|phil|pire|pl(ay|uc)|pn2|po(ck|rt|se)|prox|psio|ptg|qaa|qc(07|12|21|32|60|[2-7]|i)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h|oo|p)|sdk\/|se(c(|0|1)|47|mc|nd|ri)|sgh|shar|sie(|m)|sk0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h|v|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl|tdg|tel(i|m)|tim|tmo|to(pl|sh)|ts(70|m|m3|m5)|tx9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas|your|zeto|zte/i.test(
                    a.substr(0, 4)
                )
            )
                check = true;
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    };

    componentDidMount() {
        if (this.isOnMobile()) {
            return this.setState({ isOnMobile: true });
        }
        let params = this.getHashParams();
        console.log(params);
        if (!this.props.user) {
            if ('access_token' in params) {
                axios
                    .get('https://api.spotify.com/v1/me', {
                        headers: {
                            Authorization: `Bearer ${params.access_token}`
                        }
                    })
                    .then(res => {
                        let newUser = {
                            access_token: params.access_token,
                            displayName: res.display_name,
                            email: res.email,
                            id: res.id,
                            type: res.type,
                            country: res.country
                        };
                        this.logInUserAndGetInfo(newUser);
                        this.props.fetchRecentlyPlayed({ limit: 12 });
                    })
                    .catch(err => console.log(err));
            } else {
                window.location.replace(
                    `https://accounts.spotify.com/authorize?client_id=${
                        process.env.REACT_APP_SPOTIFY_CLIENT_ID
                    }&redirect_uri=${
                        process.env.REACT_APP_SPOTIFY_REDIRECT_URI
                    }&scope=${
                        process.env.REACT_APP_SPOTIFY_SCOPE
                    }&response_type=token`
                );
            }
        }
    }

    logInUserAndGetInfo = newUser => {
        console.log(newUser);
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

        return this.props.user ? (
            <React.Fragment>
                <SpotifyApiContext.Provider
                    value={this.props.user.access_token}
                >
                    <div
                        style={{
                            backgroundImage: this.props.backgroundImage,
                            width: '100%',
                            height: '100vh',
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat',
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            zIndex: -1000
                        }}
                    />
                    <Grid container>
                        <GridSidedrawer item lg={2}>
                            {drawer}
                        </GridSidedrawer>
                        <GridHomePage
                            item
                            lg={12}
                            style={{
                                paddingLeft:
                                    this.props.width === 'lg' ||
                                    this.props.width === 'xl'
                                        ? 255
                                        : null
                            }}
                        >
                            <Switch>
                                <Route
                                    path="/browse/:item"
                                    exact
                                    component={HomePage}
                                />
                                <Route
                                    path="/search"
                                    exact
                                    component={Search}
                                />

                                <Route
                                    path="/search/:item/:query"
                                    exact
                                    component={Search}
                                />

                                <Route
                                    path="/playlist/:id"
                                    exact
                                    component={PlaylistView}
                                />

                                <Route
                                    path="/album/:id"
                                    exact
                                    component={AlbumView}
                                />

                                <Route
                                    path="/genre/:id"
                                    component={GenreView}
                                />
                                <Route
                                    path="/artist/:id"
                                    exact
                                    component={ArtistView}
                                />
                                <Route
                                    path="/library/:item"
                                    exact
                                    component={Library}
                                />
                                <Route component={NotFound} />
                            </Switch>
                        </GridHomePage>
                    </Grid>
                    <MusicPlayer />
                </SpotifyApiContext.Provider>
            </React.Fragment>
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
        backgroundImage: state.backgroundImage
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setUser: user => dispatch({ type: actionTypes.SET_USER, user }),
        fetchRecentlyPlayed: options =>
            dispatch(actionTypes.fetchRecentlyPlayed(options))
    };
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(withWidth()(Layout))
);
