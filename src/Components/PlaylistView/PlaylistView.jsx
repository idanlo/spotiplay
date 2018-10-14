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

class PlaylistView extends Component {
    state = {
        playlist: null
    };

    shouldComponentUpdate(nextProps, nextState) {
        return (
            (this.state.playlist &&
                nextState.playlist &&
                this.state.playlist.id !== nextState.playlist.id) ||
            (!this.state.playlist && nextState.playlist) ||
            this.props.match.params.id !== nextProps.match.params.id ||
            this.props.currentlyPlaying !== nextProps.currentlyPlaying ||
            this.props.isPlaying !== nextProps.isPlaying
        );
    }

    componentDidMount() {
        if (
            this.props.api &&
            (!this.state.playlist ||
                this.state.playlist.id !== this.props.match.params.id)
        ) {
            this.getPlaylist(this.props.match.params.id);
        }
    }

    componentDidUpdate() {
        if (
            this.props.api &&
            (!this.state.playlist ||
                this.state.playlist.id !== this.props.match.params.id)
        ) {
            this.getPlaylist(this.props.match.params.id);
        }
    }

    getPlaylist = id => {
        if (id && this.props.api) {
            const { api } = this.props;
            api.getPlaylist(id).then(res => {
                this.setState({ playlist: res });
                Vibrant.from(res.images[0].url)
                    .getPalette()
                    .then(palette => {
                        let rgb = palette.DarkMuted._rgb.join(", ");
                        let color = "rgb(" + rgb + ")";
                        let bgImage = `linear-gradient(${color}, rgb(6, 9, 10) 85%)`;
                        this.props.setBackgroundImage(bgImage);
                    });
            });
        }
    };

    playSongHandler = track => {
        if (this.state.playlist) {
            let uris;
            if (track === "playlist") {
                uris = JSON.stringify({
                    context_uri: this.state.playlist.uri
                });
            } else {
                uris = JSON.stringify({
                    context_uri: this.state.playlist.uri,
                    offset: {
                        uri: track.uri
                    }
                });
            }
            this.props.playSong(uris);
        }
    };

    render() {
        const { playlist } = this.state;

        let mainContent = null;

        if (playlist) {
            mainContent = (
                <Grid container>
                    <Grid item xs={12} md={4}>
                        <div style={{ textAlign: "center" }}>
                            <img
                                src={playlist.images[0].url}
                                style={{
                                    width: "70%",
                                    height: "70%",
                                    display: "block",
                                    margin: "30px auto"
                                }}
                                alt="Playlist"
                            />
                            <Typography variant="title">
                                {playlist.name}
                            </Typography>
                            <Typography
                                variant="subheading"
                                color="textSecondary"
                            >
                                {playlist.owner.display_name}
                            </Typography>
                            <Typography
                                variant="subheading"
                                color="textSecondary"
                            >
                                {playlist.tracks.items.length + " songs"}
                            </Typography>
                            <Button
                                color="primary"
                                onClick={() => this.playSongHandler("playlist")}
                            >
                                Play
                            </Button>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <List style={{ width: "100%" }}>
                            {this.state.playlist.tracks.items.map(track => (
                                <ListItem
                                    key={track.track.id}
                                    style={
                                        this.props.currentlyPlaying ===
                                            track.track.name &&
                                        this.props.isPlaying
                                            ? { background: "#1db954" }
                                            : null
                                    }
                                >
                                    <ListItemIcon style={{ cursor: "pointer" }}>
                                        {this.props.currentlyPlaying ===
                                            track.track.name &&
                                        this.props.isPlaying ? (
                                            <PauseIcon
                                                onClick={this.props.pauseSong}
                                            />
                                        ) : (
                                            <PlayArrowIcon
                                                onClick={() =>
                                                    this.playSongHandler(
                                                        track.track
                                                    )
                                                }
                                            />
                                        )}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={track.track.name}
                                        secondary={
                                            track.track.artists
                                                .map(artist => artist.name)
                                                .join(", ") +
                                            " • " +
                                            track.track.album.name
                                        }
                                    >
                                        {track.track.name}
                                    </ListItemText>
                                </ListItem>
                            ))}
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
        user: state.current_user,
        currentlyPlaying: state.currently_playing,
        isPlaying: state.isPlaying
    };
};

const mapDispatchToProps = dispatch => {
    return {
        pauseSong: () => dispatch(actionTypes.pauseSong()),
        playSong: uris => dispatch(actionTypes.playSong(uris)),
        setBackgroundImage: backgroundImage =>
            dispatch({
                type: actionTypes.SET_BACKGROUND_IMAGE,
                backgroundImage
            })
    };
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(withSpotifyApi(PlaylistView))
);
