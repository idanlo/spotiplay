import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import { Typography, Grid } from "@material-ui/core";
import * as actionTypes from "../../store/actions/actionTypes";
import withSpotifyApi from "../../HOC/withSpotifyApi";
import MediaCard from "../MediaCard/MediaCard";

const TypographyHeader = styled(Typography).attrs({
    variant: "display2",
    align: "center",
    color: "secondary"
})`
    padding: 10px;
`;

export class GenreView extends Component {
    state = {
        playlists: null,
        genre: null
    };

    componentDidMount() {
        if (this.props.api && this.props.match.params.id) {
            const { api } = this.props;
            const { id } = this.props.match.params;
            api.getCategoryPlaylists(id)
                .then(res => {
                    const { playlists } = res;
                    // console.log(playlists);
                    const genre = id.charAt(0).toUpperCase() + id.substr(1);
                    this.setState({ playlists, genre });
                })
                .catch(err => {
                    console.error(err);
                });
        }
    }
    render() {
        let genrePlaylists = null;

        if (this.state.playlists && this.state.playlists.items.length > 0) {
            genrePlaylists = this.state.playlists.items.map(playlist => (
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
            ));

            genrePlaylists = (
                <div>
                    <TypographyHeader>{this.state.genre}</TypographyHeader>
                    <Grid
                        container
                        spacing={16}
                        style={{ margin: 0, width: "100%" }}
                    >
                        {genrePlaylists}
                    </Grid>
                </div>
            );
        }

        return <div>{genrePlaylists}</div>;
    }
}

const mapDispatchToProps = dispatch => {
    return {
        playSong: uris => dispatch(actionTypes.playSong(uris))
    };
};

export default withRouter(
    connect(
        null,
        mapDispatchToProps
    )(withSpotifyApi(GenreView))
);
