import React, { Component } from "react";
import { connect } from "react-redux";
import * as actionTypes from "../../store/actions/actionTypes";
import { Switch, Route } from "react-router-dom";
import withSpotifyApi from "../../HOC/withSpotifyApi";
import {
    Grid,
    List,
    ListItem,
    ListItemText,
    ListItemIcon
} from "@material-ui/core";
import PauseIcon from "@material-ui/icons/Pause";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import Navigation from "../Navigation/Navigation";
import MediaCard from "../MediaCard/MediaCard";

class Library extends Component {
    state = {
        savedAlbums: null,
        savedTracks: null,
        savedPlaylists: null
    };

    componentDidMount() {
        const { api } = this.props;
        if (api) {
            api.getUserPlaylists(this.props.user.id).then(res => {
                this.setState({ savedPlaylists: res.items });
            });
            api.getMySavedAlbums().then(res => {
                this.setState({ savedAlbums: res.items });
            });
            api.getMySavedTracks({ limit: 50 }).then(res => {
                this.setState({ savedTracks: res.items });
            });
        }
    }

    render() {
        const NavigationItems = [
            {
                link: "/library/playlists",
                text: "Playlists"
            },
            {
                link: "/library/albums",
                text: "Albums"
            },
            {
                link: "/library/tracks",
                text: "Tracks"
            }
        ];

        let savedPlaylists = null;

        if (this.state.savedPlaylists && this.state.savedPlaylists.length > 0) {
            savedPlaylists = this.state.savedPlaylists.map(playlist => (
                <MediaCard
                    key={playlist.id}
                    link={`/playlist/${playlist.id}`}
                    img={playlist.images[0].url}
                    content={playlist.name}
                    playSong={() =>
                        this.props.playSong(
                            JSON.stringify({ context_uri: playlist.uri })
                        )
                    }
                />
            ));

            savedPlaylists = (
                <Grid
                    container
                    spacing={16}
                    style={{ margin: 0, width: "100%" }} // inline styles overwrite the material ui styles (no spacing on the left side)
                >
                    {savedPlaylists}
                </Grid>
            );
        }

        let savedAlbums = null;

        if (this.state.savedAlbums && this.state.savedAlbums.length > 0) {
            savedAlbums = this.state.savedAlbums.map(album => (
                <MediaCard
                    key={album.album.id}
                    link={"/album/" + album.album.id}
                    img={album.album.images[0].url}
                    content={album.album.name}
                    playSong={() =>
                        this.props.playSong(
                            JSON.stringify({ context_uri: album.album.uri })
                        )
                    }
                />
            ));
            savedAlbums = (
                <Grid
                    container
                    spacing={16}
                    style={{ margin: 0, width: "100%" }} // inline styles overwrite the material ui styles (no spacing on the left side)
                >
                    {savedAlbums}
                </Grid>
            );
        }

        let savedTracks = null;

        if (this.state.savedTracks && this.state.savedTracks.length > 0) {
            savedTracks = this.state.savedTracks.map(track => (
                <ListItem
                    key={track.track.id}
                    style={
                        this.props.currentlyPlaying === track.track.name &&
                        this.props.isPlaying
                            ? { background: "#1db954" }
                            : null
                    }
                >
                    <ListItemIcon style={{ cursor: "pointer" }}>
                        {this.props.currentlyPlaying === track.track.name &&
                        this.props.isPlaying ? (
                            <PauseIcon
                                style={{ color: "green" }}
                                onClick={this.props.pauseSong}
                            />
                        ) : (
                            <PlayArrowIcon
                                onClick={() =>
                                    this.props.playSong(
                                        JSON.stringify({
                                            context_uri: track.track.album.uri,
                                            offset: { uri: track.track.ui }
                                        })
                                    )
                                }
                            />
                        )}
                    </ListItemIcon>
                    <ListItemText>{track.track.name}</ListItemText>
                </ListItem>
            ));

            savedTracks = <List>{savedTracks}</List>;
        }

        return (
            <Grid container>
                <Navigation items={NavigationItems} />
                <Grid item xs={12}>
                    <Switch>
                        <Route
                            path="/library/playlists"
                            render={() => savedPlaylists}
                        />
                        <Route
                            path="/library/albums"
                            render={() => savedAlbums}
                        />
                        <Route
                            path="/library/tracks"
                            render={() => savedTracks}
                        />
                    </Switch>
                </Grid>
            </Grid>
        );
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
        playSong: uris => dispatch(actionTypes.playSong(uris))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withSpotifyApi(Library));
