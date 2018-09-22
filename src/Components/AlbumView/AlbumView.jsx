import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import * as actionTypes from "../../store/actions/actionTypes";
import withSpotifyApi from "../../HOC/withSpotifyApi";
import { connect } from "react-redux";
import Vibrant from "node-vibrant";
import {
    Grid,
    Typography,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemIcon
} from "@material-ui/core";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import { TrackDetailsLink } from "../UI/TrackDetailsLink";
import { milisToMinutesAndSeconds } from "../../utils/index";

class AlbumView extends Component {
    state = {
        album: null,
        isAlbumSaved: false
    };

    shouldComponentUpdate(nextProps, nextState) {
        return (
            (this.state.album &&
                nextState.album &&
                this.state.album.id !== nextState.album.id) ||
            (!this.state.album && nextState.album) ||
            this.props.match.params.id !== nextProps.match.params.id ||
            this.props.currentlyPlaying !== nextProps.currentlyPlaying ||
            this.props.isPlaying !== nextProps.isPlaying ||
            this.state.isAlbumSaved !== nextState.isAlbumSaved
        );
    }

    componentDidMount() {
        if (
            this.props.api &&
            (!this.state.album ||
                this.state.album.id !== this.props.match.params.id)
        ) {
            this.getAlbum();
            this.checkIsAlbumSaved();
        }
    }

    componentDidUpdate() {
        if (
            this.props.api &&
            (!this.state.album ||
                this.state.album.id !== this.props.match.params.id)
        ) {
            this.getAlbum();
            this.checkIsAlbumSaved();
        }
    }

    getAlbum = () => {
        this.props.api.getAlbum(this.props.match.params.id).then(res => {
            this.setState({ album: res });
            Vibrant.from(res.images[0].url)
                .getPalette()
                .then(palette => {
                    let rgb = palette.DarkMuted._rgb.join(", ");
                    let color = "rgb(" + rgb + ")";
                    let bgImage = `linear-gradient(${color}, rgb(6, 9, 10) 85%)`;
                    this.props.setBackgroundImage(bgImage);
                });
        });
    };

    checkIsAlbumSaved = () => {
        // assuming this.state.album does not exist because it hasn't loaded yet so i am using the id from the url.
        if (this.props.api) {
            this.props.api
                .containsMySavedAlbums([this.props.match.params.id])
                .then(res => {
                    this.setState({ isAlbumSaved: res[0] });
                });
        }
    };

    saveAlbum = () => {
        // assuming this.state.album does exist because the save button should not appear unless there is an album.
        if (this.props.api) {
            this.props.api
                .addToMySavedAlbums([this.state.album.id])
                .then(res => {
                    this.setState({ isAlbumSaved: true });
                });
        }
    };

    playSongHandler = track => {
        if (this.state.album) {
            let uris;
            if (track === "album") {
                uris = JSON.stringify({
                    context_uri: this.state.album.uri
                });
            } else {
                uris = JSON.stringify({
                    context_uri: this.state.album.uri,
                    offset: {
                        uri: track.uri
                    }
                });
            }
            this.props.playSong(uris);
        }
    };

    render() {
        const { album } = this.state;

        let mainContent = <h1>Loading...</h1>;

        if (album) {
            mainContent = (
                <Grid container>
                    <Grid item xs={12} md={4}>
                        <div style={{ textAlign: "center" }}>
                            <img
                                src={album.images[0].url}
                                style={{
                                    width: "70%",
                                    height: "70%",
                                    display: "block",
                                    margin: "30px auto"
                                }}
                                alt="Album"
                            />
                            <Typography variant="title">
                                {album.name}
                            </Typography>
                            <Typography
                                variant="subheading"
                                color="textSecondary"
                            >
                                {album.artists
                                    .map(artist => artist.name)
                                    .join(", ")}
                            </Typography>
                            <Typography
                                variant="subheading"
                                color="textSecondary"
                            >
                                {album.release_date.substring(0, 4) +
                                    " • " +
                                    album.tracks.items.length +
                                    " songs"}
                            </Typography>
                            <Button
                                color="primary"
                                disabled={this.state.isAlbumSaved}
                                onClick={this.saveAlbum}
                            >
                                Save
                            </Button>
                            <Button
                                color="primary"
                                onClick={() => this.playSongHandler("album")}
                            >
                                Play
                            </Button>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <List style={{ width: "100%" }}>
                            {this.state.album.tracks.items.map(track => {
                                const ArtistAlbumLink = (
                                    <React.Fragment>
                                        {track.artists.map((artist, index) => (
                                            <React.Fragment key={artist.id}>
                                                <TrackDetailsLink
                                                    to={"/artist/" + artist.id}
                                                >
                                                    {artist.name}
                                                </TrackDetailsLink>
                                                {index !==
                                                track.artists.length - 1
                                                    ? ", "
                                                    : null}
                                            </React.Fragment>
                                        ))}
                                        <span> • </span>
                                        <TrackDetailsLink
                                            to={"/album/" + this.state.album.id}
                                        >
                                            {this.state.album.name}
                                        </TrackDetailsLink>
                                    </React.Fragment>
                                );
                                return (
                                    <ListItem
                                        key={track.id}
                                        style={
                                            this.props.currentlyPlaying ===
                                                track.name &&
                                            this.props.isPlaying
                                                ? { background: "#1db954" }
                                                : null
                                        }
                                    >
                                        <ListItemIcon
                                            style={{ cursor: "pointer" }}
                                        >
                                            {this.props.currentlyPlaying ===
                                                track.name &&
                                            this.props.isPlaying ? (
                                                <PauseIcon
                                                    onClick={
                                                        this.props.pauseSong
                                                    }
                                                />
                                            ) : (
                                                <PlayArrowIcon
                                                    onClick={() =>
                                                        this.playSongHandler(
                                                            track
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
            );
        }
        return mainContent;
    }
}

const mapStateToProps = state => {
    return {
        currentlyPlaying: state.currently_playing,
        isPlaying: state.isPlaying
    };
};

const mapDispatchToProps = dispatch => {
    return {
        pauseSong: () => dispatch(actionTypes.pauseSong()),
        setBackgroundImage: backgroundImage =>
            dispatch({
                type: actionTypes.SET_BACKGROUND_IMAGE,
                backgroundImage
            }),
        playSong: uris => dispatch(actionTypes.playSong(uris))
    };
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(withSpotifyApi(AlbumView))
);
