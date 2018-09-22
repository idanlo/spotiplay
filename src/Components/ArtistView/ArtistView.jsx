import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import * as actionTypes from "../../store/actions/actionTypes";
import withSpotifyApi from "../../HOC/withSpotifyApi";
import { connect } from "react-redux";
import {
    Grid,
    Typography,
    Button,
    List,
    Avatar,
    ListItem,
    ListItemText,
    ListItemIcon
} from "@material-ui/core";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";

class ArtistView extends Component {
    state = {
        artist: null,
        artistTopTracks: null
    };

    shouldComponentUpdate(nextProps, nextState) {
        return (
            (this.state.artist &&
                nextState.artist &&
                this.state.artist.id !== nextState.artist.id) ||
            (!this.state.artist && nextState.artist) ||
            this.props.match.params.id !== nextProps.match.params.id ||
            this.props.isPlaying !== nextProps.isPlaying ||
            this.props.currentlyPlaying !== nextProps.currentlyPlaying
        );
    }

    componentDidMount() {
        if (this.props.api) {
            const { api } = this.props;
            if (
                !this.state.artist ||
                this.state.artist.id !== this.props.match.params.id
            ) {
                let { id } = this.props.match.params;
                api.getArtist(id).then(res => {
                    let artist = res;
                    api.getArtistTopTracks(id, this.props.user.country).then(
                        res => {
                            let artistTopTracks = res.tracks;
                            this.setState({ artistTopTracks, artist });
                        }
                    );
                });
            }
        }
    }

    componentDidUpdate() {
        // THIS CONSOLE LOG IS EXECUTING TWICE EVERY ROUTE CHANGE
        console.log("[ArtistView] UPDATE!");
        // console.log(this.props);
        if (this.props.api && this.props.match.params.id) {
            const { api } = this.props;
            let { id } = this.props.match.params;
            if (
                !this.state.artist ||
                this.state.artist.id !== this.props.match.params.id
            ) {
                api.getArtist(id).then(res => {
                    console.log(res);
                    this.setState({ artist: res });
                });
            }
            if (!this.state.artistTopTracks) {
                api.getArtistTopTracks(id, this.props.user.country).then(
                    res => {
                        console.log(res.tracks);
                        this.setState({ artistTopTracks: res.tracks });
                    }
                );
            }
        }
    }

    playSongHandler = track => {
        if (this.state.artist) {
            let uris;
            if (track === "artist") {
                uris = JSON.stringify({
                    context_uri: this.state.artist.uri
                });
            } else {
                uris = JSON.stringify({
                    context_uri: track.album.uri,
                    offset: {
                        uri: track.uri
                    }
                });
            }
            this.props.playSong(uris);
        }
    };

    render() {
        const { artist } = this.state;

        let ArtistHeader = <h1>Loading...</h1>;

        if (artist) {
            ArtistHeader = (
                <Grid item xs={12} style={{ width: "100%" }}>
                    <div style={{ textAlign: "center" }}>
                        <Avatar
                            src={artist.images[0].url}
                            style={{
                                margin: "0 auto",
                                width: 300,
                                height: 300,
                                marginBottom: 10
                            }}
                        />
                        <Typography variant="title">{artist.name}</Typography>
                        <Button
                            color="primary"
                            onClick={() => this.playSongHandler("artist")}
                        >
                            Play
                        </Button>
                    </div>
                </Grid>
            );
        }
        const { artistTopTracks } = this.state;

        let ArtistTopTracksList = <h1>Loading...</h1>;
        console.log(this.state.artistTopTracks);
        if (artistTopTracks) {
            ArtistTopTracksList = (
                <List style={{ width: "100%" }}>
                    {artistTopTracks.map(track => (
                        <ListItem key={track.id}>
                            <ListItemIcon style={{ cursor: "pointer" }}>
                                {this.props.currentlyPlaying === track.name &&
                                this.props.isPlaying ? (
                                    <PauseIcon onClick={this.props.pauseSong} />
                                ) : (
                                    <PlayArrowIcon
                                        onClick={() =>
                                            this.playSongHandler(track)
                                        }
                                    />
                                )}
                            </ListItemIcon>
                            <ListItemText
                                primary={track.name}
                                secondary={track.album.name}
                            />
                        </ListItem>
                    ))}
                </List>
            );
        }
        return (
            <Grid container>
                {ArtistHeader}
                {ArtistTopTracksList}
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
        playSong: uris => dispatch(actionTypes.playSong(uris)),
        pauseSong: () => dispatch(actionTypes.pauseSong())
    };
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(withSpotifyApi(ArtistView))
);
