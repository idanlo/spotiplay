import React from "react";
import { withRouter, Switch, Route } from "react-router-dom";
import { connect } from "react-redux";
import {
    Grid,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemIcon
} from "@material-ui/core";
import PauseIcon from "@material-ui/icons/Pause";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import * as actionTypes from "../../../store/actions/actionTypes";
import Navigation from "../../Navigation/Navigation";
import MediaCard from "../../MediaCard/MediaCard";
import { TrackDetailsLink } from "../../UI/TrackDetailsLink";
import { milisToMinutesAndSeconds } from "../../../utils/index";

const SearchResults = props => {
    console.log("[SearchResults] Update!");
    const NavigationItems = [
        {
            link: "/search/results/" + props.match.params.query,
            text: "Top Reults"
        },
        {
            link: "/search/artists/" + props.match.params.query,
            text: "Artists"
        },
        {
            link: "/search/tracks/" + props.match.params.query,
            text: "Tracks"
        },
        {
            link: "/search/albums/" + props.match.params.query,
            text: "Albums"
        },
        {
            link: "/search/playlists/" + props.match.params.query,
            text: "Playlists"
        }
    ];

    let TopResults = <h1>Loading...</h1>;

    if (
        props.results.artists &&
        props.results.albums &&
        props.results.playlists &&
        props.results.tracks
    ) {
        TopResults = (
            <Grid container>
                {props.results.artists.length > 0 &&
                props.results.tracks.length > 0 ? (
                    <Grid
                        container
                        spacing={16}
                        style={{ margin: 0, width: "100%" }}
                    >
                        <MediaCard
                            rounded
                            link={"/artist/" + props.results.artists[0].id}
                            img={
                                props.results.artists[0].images.length > 0
                                    ? props.results.artists[0].images[0].url
                                    : null
                            }
                            content={props.results.artists[0].name}
                            playSong={() =>
                                props.playSong(
                                    JSON.stringify({
                                        context_uri:
                                            props.results.artists[0].uri
                                    })
                                )
                            }
                        />
                        <Grid item xs={12} sm={6} md={10}>
                            <List>
                                {props.results.tracks.slice(0, 6).map(track => {
                                    const ArtistAlbumLink = (
                                        <React.Fragment>
                                            {track.artists.map(
                                                (artist, index) => (
                                                    <React.Fragment
                                                        key={artist.id}
                                                    >
                                                        <TrackDetailsLink
                                                            to={
                                                                "/artist/" +
                                                                artist.id
                                                            }
                                                        >
                                                            {artist.name}
                                                        </TrackDetailsLink>
                                                        {index !==
                                                        track.artists.length - 1
                                                            ? ", "
                                                            : null}
                                                    </React.Fragment>
                                                )
                                            )}
                                            <span> • </span>
                                            <TrackDetailsLink
                                                to={"/album/" + track.album.id}
                                            >
                                                {track.album.name}
                                            </TrackDetailsLink>
                                        </React.Fragment>
                                    );
                                    return (
                                        <ListItem
                                            key={track.id}
                                            style={
                                                props.currentlyPlaying ===
                                                    track.name &&
                                                props.isPlaying
                                                    ? { background: "#1db954" }
                                                    : null
                                            }
                                        >
                                            <ListItemIcon
                                                style={{ cursor: "pointer" }}
                                            >
                                                {props.currentlyPlaying ===
                                                    track.name &&
                                                props.isPlaying ? (
                                                    <PauseIcon
                                                        onClick={
                                                            props.pauseSong
                                                        }
                                                    />
                                                ) : (
                                                    <PlayArrowIcon
                                                        onClick={() =>
                                                            props.playSong(
                                                                JSON.stringify({
                                                                    context_uri:
                                                                        track
                                                                            .album
                                                                            .uri,
                                                                    offset: {
                                                                        uri:
                                                                            track.uri
                                                                    }
                                                                })
                                                            )
                                                        }
                                                    />
                                                )}
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={track.name}
                                                secondary={ArtistAlbumLink}
                                            />
                                            <ListItemText
                                                style={{ textAlign: "right" }}
                                                primary={milisToMinutesAndSeconds(
                                                    track.duration_ms
                                                )}
                                            />
                                        </ListItem>
                                    );
                                })}
                            </List>
                        </Grid>
                    </Grid>
                ) : null}
                {props.results.artists.length > 0 ? (
                    <div style={{ width: "100%" }}>
                        <Typography
                            style={{ padding: 10 }}
                            color="secondary"
                            variant="title"
                            align="center"
                        >
                            Artists
                        </Typography>
                        <Grid
                            container
                            spacing={16}
                            style={{ margin: 0, width: "100%" }}
                        >
                            {props.results.artists.slice(0, 6).map(artist => (
                                <MediaCard
                                    rounded
                                    key={artist.id}
                                    link={"/artist/" + artist.id}
                                    img={artist.images[0].url}
                                    content={artist.name}
                                    playSong={() =>
                                        props.playSong(
                                            JSON.stringify({
                                                context_uri: artist.uri
                                            })
                                        )
                                    }
                                />
                            ))}
                        </Grid>
                    </div>
                ) : null}
                {props.results.albums.length > 0 ? (
                    <div style={{ width: "100%" }}>
                        <Typography
                            style={{ padding: 10 }}
                            color="secondary"
                            variant="title"
                            align="center"
                        >
                            Albums
                        </Typography>
                        <Grid
                            container
                            spacing={16}
                            style={{ margin: 0, width: "100%" }}
                        >
                            {props.results.albums.slice(0, 6).map(album => (
                                <MediaCard
                                    key={album.id}
                                    link={"/album/" + album.id}
                                    img={album.images[0].url}
                                    content={`${album.artists
                                        .map(a => a.name)
                                        .join(", ")} - ${album.name}`}
                                    playSong={() =>
                                        props.playSong(
                                            JSON.stringify({
                                                context_uri: album.uri
                                            })
                                        )
                                    }
                                />
                            ))}
                        </Grid>
                    </div>
                ) : null}
            </Grid>
        );
    }

    let Artists = <h1>Loading...</h1>;

    if (props.results.artists && props.results.artists.length > 0) {
        Artists = (
            <Grid container spacing={16} style={{ margin: 0, width: "100%" }}>
                {props.results.artists.map(artist => (
                    <MediaCard
                        rounded
                        key={artist.id}
                        link={"/album/" + artist.id}
                        img={artist.images[0].url}
                        content={artist.name}
                        playSong={() =>
                            props.playSong(
                                JSON.stringify({
                                    context_uri: artist.uri
                                })
                            )
                        }
                    />
                ))}
            </Grid>
        );
    }

    let Tracks = <h1>Loading...</h1>;

    if (props.results.tracks && props.results.tracks.length > 0) {
        Tracks = (
            <List style={{ width: "100%" }}>
                {props.results.tracks.map(track => {
                    const ArtistAlbumLink = (
                        <div>
                            {track.artists.map((artist, index) => (
                                <React.Fragment key={artist.id}>
                                    <TrackDetailsLink
                                        to={"/artist/" + artist.id}
                                    >
                                        {artist.name}
                                    </TrackDetailsLink>
                                    {index !== track.artists.length - 1
                                        ? ", "
                                        : null}
                                </React.Fragment>
                            ))}
                            <span> • </span>
                            <TrackDetailsLink to={"/album/" + track.album.id}>
                                {track.album.name}
                            </TrackDetailsLink>
                        </div>
                    );
                    return (
                        <ListItem
                            key={track.id}
                            style={
                                props.currentlyPlaying === track.name &&
                                props.isPlaying
                                    ? { background: "#1db954" }
                                    : null
                            }
                        >
                            <ListItemIcon style={{ cursor: "pointer" }}>
                                {props.currentlyPlaying === track.name &&
                                props.isPlaying ? (
                                    <PauseIcon onClick={props.pauseSong} />
                                ) : (
                                    <PlayArrowIcon
                                        onClick={() =>
                                            props.playSong(
                                                JSON.stringify({
                                                    context_uri:
                                                        track.album.uri,
                                                    offset: {
                                                        uri: track.uri
                                                    }
                                                })
                                            )
                                        }
                                    />
                                )}
                            </ListItemIcon>
                            <ListItemText
                                primary={track.name}
                                secondary={ArtistAlbumLink}
                            />
                            <ListItemText
                                style={{ textAlign: "right" }}
                                primary={milisToMinutesAndSeconds(
                                    track.duration_ms
                                )}
                            />
                        </ListItem>
                    );
                })}
            </List>
        );
    }

    let Albums = <h1>Loading...</h1>;

    if (props.results.albums && props.results.albums.length > 0) {
        Albums = (
            <Grid container spacing={16} style={{ margin: 0, width: "100%" }}>
                {props.results.albums.map(album => (
                    <MediaCard
                        key={album.id}
                        link={"/album/" + album.id}
                        img={album.images[0].url}
                        content={`${album.artists
                            .map(a => a.name)
                            .join(", ")} - ${album.name}`}
                        playSong={() =>
                            props.playSong(
                                JSON.stringify({
                                    context_uri: album.uri
                                })
                            )
                        }
                    />
                ))}
            </Grid>
        );
    }

    let Playlists = <h1>Loading...</h1>;

    if (props.results.playlists && props.results.playlists.length > 0) {
        Playlists = (
            <Grid container spacing={16} style={{ margin: 0, width: "100%" }}>
                {props.results.playlists.map(playlist => (
                    <MediaCard
                        key={playlist.id}
                        link={"/playlist/" + playlist.id}
                        img={playlist.images[0].url}
                        content={playlist.name}
                        playSong={() =>
                            props.playSong(
                                JSON.stringify({
                                    context_uri: playlist.uri
                                })
                            )
                        }
                    />
                ))}
            </Grid>
        );
    }

    return (
        <Grid container style={{ width: "100%", margin: 0 }}>
            {props.results.artists &&
            props.results.albums &&
            props.results.playlists &&
            props.results.tracks ? (
                <React.Fragment>
                    <Navigation items={NavigationItems} width="60%" />
                    <Switch>
                        <Route
                            path="/search/results/:query"
                            exact
                            render={() => TopResults}
                        />
                        <Route
                            path="/search/artists/:query"
                            exact
                            render={() => Artists}
                        />
                        <Route
                            path="/search/tracks/:query"
                            exact
                            render={() => Tracks}
                        />
                        <Route
                            path="/search/albums/:query"
                            exact
                            render={() => Albums}
                        />
                        <Route
                            path="/search/playlists/:query"
                            exact
                            render={() => Playlists}
                        />
                    </Switch>
                </React.Fragment>
            ) : null}
        </Grid>
    );
};

const mapStateToProps = state => {
    return {
        currentlyPlaying: state.currently_playing,
        isPlaying: state.isPlaying
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setPlayNow: (uri, uri_type) =>
            dispatch({ type: actionTypes.SET_PLAY_NOW, uri, uri_type }),
        pauseSong: () => dispatch(actionTypes.pauseSong()),
        playSong: uris => dispatch(actionTypes.playSong(uris))
    };
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(SearchResults)
);
