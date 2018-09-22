import React, { Component } from "react";
import { connect } from "react-redux";
import { Switch, Route } from "react-router-dom";
import { Grid, Typography } from "@material-ui/core";
import MediaCard from "../MediaCard/MediaCard";
import * as actionTypes from "../../store/actions/actionTypes";
import Navigation from "../Navigation/Navigation";
import withSpotifyApi from "../../HOC/withSpotifyApi";
import styled from "styled-components";

const TypographyHeader = styled(Typography).attrs({
    variant: "display2",
    align: "center",
    color: "secondary"
})`
    padding: 10px;
`;

class HomePage extends Component {
    state = {
        featuredPlaylists: null,
        genres: null,
        newReleases: null,
        recommended: null
    };

    componentDidMount() {
        // const spotifyWebApi = GetSpotifyInstance(this.props.user.access_token);
        const spotifyWebApi = this.props.api;
        spotifyWebApi.getFeaturedPlaylists().then(res => {
            let info = res;
            console.log(info);
            this.setState({ featuredPlaylists: info });
        });

        spotifyWebApi.getCategories({ limit: 12 }).then(res => {
            let info = res.categories.items;
            console.log(info);
            this.setState({ genres: info });
        });
        spotifyWebApi.getNewReleases({ limit: 12 }).then(res => {
            let info = res.albums.items;
            console.log(info);
            this.setState({ newReleases: info });
        });
        this.props.setBackgroundImage(
            "linear-gradient(rgb(58, 91, 95), rgb(6, 9, 10) 85%)"
        );
    }

    componentDidUpdate() {
        // this.props.recently_played may not be available on componentDidMount so I'm checking every update.
        // once this.props.recently_played exists then I do the request (one time)
        if (
            this.props.api &&
            !this.state.recommended &&
            this.props.recently_played
        ) {
            // this.props.api.getRecommendations({ limit: 12 }).then(res => {
            //     console.log("RECOMMENDED: ", res);
            // });
        }
    }

    render() {
        const NavigationItems = [
            {
                link: "/browse/featured",
                text: "Featured"
            },
            {
                link: "/browse/genres",
                text: "Genres & Moods"
            },
            {
                link: "/browse/new",
                text: "New Releases"
            },
            {
                link: "/browse/discover",
                text: "Discover"
            }
        ];

        let recentlyPlayed = null;
        if (this.props.recently_played) {
            recentlyPlayed = this.props.recently_played.map(track => {
                let artist = track.track.artists
                    .map(name => name.name)
                    .join(", ");
                return (
                    <MediaCard
                        key={`${track.track.id} - ${track.played_at}`} // There is a problem with the artist id only because some recently played songs appear couple of times so they key isn't unique
                        link={"/album/" + track.track.album.id}
                        img={track.track.album.images[0].url}
                        content={`${artist} - ${track.track.name}`}
                        playSong={() =>
                            this.props.playSong(
                                JSON.stringify({
                                    context_uri: track.track.album.uri,
                                    offset: {
                                        uri: track.track.uri
                                    }
                                })
                            )
                        }
                    />
                );
            });

            recentlyPlayed = (
                <div>
                    <TypographyHeader>Recently Played</TypographyHeader>
                    <Grid
                        container
                        spacing={16}
                        style={{ margin: 0, width: "100%" }} // inline styles overwrite the material ui styles (no spacing on the left side)
                    >
                        {recentlyPlayed}
                    </Grid>
                </div>
            );
        }

        let featuredPlaylists = null;
        if (this.state.featuredPlaylists) {
            featuredPlaylists = this.state.featuredPlaylists.playlists.items.map(
                playlist => (
                    <MediaCard
                        link={`/playlist/${playlist.id}`}
                        key={playlist.id}
                        img={playlist.images[0].url}
                        content={playlist.name}
                        playSong={() =>
                            this.props.playSong(
                                JSON.stringify({
                                    context_uri: playlist.uri
                                })
                            )
                        }
                    />
                )
            );

            featuredPlaylists = (
                <div>
                    <TypographyHeader>
                        {this.state.featuredPlaylists.message}
                    </TypographyHeader>
                    <Grid
                        container
                        spacing={16}
                        style={{ margin: 0, width: "100%" }} // inline styles overwrite the material ui styles (no spacing on the left side)
                    >
                        {featuredPlaylists}
                    </Grid>
                </div>
            );
        }

        let genres = null;
        if (this.state.genres) {
            genres = this.state.genres.map(genre => (
                <MediaCard
                    link={"/genre/" + genre.id}
                    key={genre.id}
                    img={genre.icons[0].url}
                    content={genre.name}
                />
            ));

            genres = (
                <div>
                    <TypographyHeader>Genres & Moods</TypographyHeader>
                    <Grid
                        container
                        spacing={16}
                        style={{ margin: 0, width: "100%" }} // inline styles overwrite the material ui styles (no spacing on the left side)
                    >
                        {genres}
                    </Grid>
                </div>
            );
        }

        let newReleases = null;
        if (this.state.newReleases) {
            newReleases = this.state.newReleases.map(album => (
                <MediaCard
                    key={album.id}
                    link={"/album/" + album.id}
                    img={album.images[0].url}
                    content={album.name}
                    playSong={() =>
                        this.props.playSong(
                            JSON.stringify({ context_uri: album.uri })
                        )
                    }
                />
            ));

            newReleases = (
                <div>
                    <TypographyHeader>New Releases</TypographyHeader>
                    <Grid
                        container
                        spacing={16}
                        style={{ margin: 0, width: "100%" }}
                    >
                        {newReleases}
                    </Grid>
                </div>
            );
        }

        return (
            <Grid container>
                <Navigation items={NavigationItems} />
                <Switch>
                    <Route
                        path="/browse/featured"
                        exact
                        render={() => (
                            <div>
                                {recentlyPlayed}
                                {featuredPlaylists}
                            </div>
                        )}
                    />
                    <Route path="/browse/genres" exact render={() => genres} />
                    <Route
                        path="/browse/new"
                        exact
                        render={() => newReleases}
                    />
                    <Route
                        path="/browse/discover"
                        exact
                        render={() => recentlyPlayed}
                    />
                </Switch>
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.current_user,
        recently_played: state.recently_played
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setBackgroundImage: backgroundImage =>
            dispatch({
                type: actionTypes.SET_BACKGROUND_IMAGE,
                backgroundImage
            }),
        playSong: uris => dispatch(actionTypes.playSong(uris))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withSpotifyApi(HomePage));
