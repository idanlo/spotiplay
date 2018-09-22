import React, { Component } from "react";
import { connect } from "react-redux";
import * as SpotifyWebApi from "spotify-web-api-js";

const withSpotifyApi = WrappedComponent => {
    class withSpotifyApiComponent extends Component {
        state = {
            api: null
        };
        componentDidMount() {
            if (this.props.user) {
                const api = new SpotifyWebApi();
                api.setAccessToken(this.props.user.access_token);
                this.setState({ api });
            }
        }

        render() {
            if (this.state.api) {
                return (
                    <WrappedComponent api={this.state.api} {...this.props} />
                );
            } else {
                return <h1>Loading</h1>;
            }
        }
    }
    const mapStateToProps = state => {
        return {
            user: state.current_user
        };
    };

    return connect(mapStateToProps)(withSpotifyApiComponent);
};

export default withSpotifyApi;
