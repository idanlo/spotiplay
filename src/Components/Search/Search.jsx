import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import * as actionTypes from "../../store/actions/actionTypes";
import withSpotifyApi from "../../HOC/withSpotifyApi";
import SearchInput from "./SearchInput/SearchInput";
import SearchResults from "./SearchResults/SearchResults";
import { Grid } from "@material-ui/core";

class Search extends Component {
    state = {
        query: "", // used for the search input, updated every keystroke
        results: {
            tracks: null,
            playlists: null,
            artists: null,
            albums: null
        }
    };

    componentDidMount() {
        if (this.props.match.params.query) {
            const { query } = this.props.match.params;
            this.setState({ query });
            this.fetchData(query);
        }
        this.props.setBackgroundImage(
            "linear-gradient(rgb(18, 18, 18), rgb(8, 8, 8) 85%)"
        );
    }

    queryChangedHandler = e => {
        const { value } = e.target;
        this.setState({ query: value });
    };

    formSubmittedHandler = e => {
        e.preventDefault();
        const { query } = this.state;
        this.props.history.push("/search/results/" + query);
        this.fetchData(query);
    };

    fetchData = query => {
        if (this.props.api) {
            const { api } = this.props;
            const options = {
                limit: 12,
                market: "from_token"
            };
            api.searchTracks(query, options).then(res => {
                let results = { ...this.state.results };
                results.tracks = res.tracks.items;
                this.setState({ results });
            });
            api.searchArtists(query, options).then(res => {
                let results = { ...this.state.results };
                results.artists = res.artists.items;
                this.setState({ results });
            });
            api.searchPlaylists(query, options).then(res => {
                let results = { ...this.state.results };
                results.playlists = res.playlists.items;
                this.setState({ results });
            });
            api.searchAlbums(query, options).then(res => {
                let results = { ...this.state.results };
                results.albums = res.albums.items;
                this.setState({ results });
            });
        }
    };

    render() {
        return (
            <Grid container style={{ margin: 0, width: "100%" }}>
                <SearchInput
                    queryChanged={this.queryChangedHandler}
                    formSubmitted={this.formSubmittedHandler}
                    value={this.state.query}
                />
                <SearchResults results={this.state.results} />
            </Grid>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setBackgroundImage: backgroundImage =>
            dispatch({
                type: actionTypes.SET_BACKGROUND_IMAGE,
                backgroundImage
            })
    };
};

export default withRouter(
    connect(
        null,
        mapDispatchToProps
    )(withSpotifyApi(Search))
);
