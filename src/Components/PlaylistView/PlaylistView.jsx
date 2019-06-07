import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import * as actionTypes from '../../store/actions/actionTypes';
import { connect } from 'react-redux';
import { Playlist } from 'react-spotify-api';
import Vibrant from 'node-vibrant';
import {
  Grid,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import { TrackDetailsLink } from '../UI/TrackDetailsLink';
import PauseIcon from '@material-ui/icons/Pause';

class PlaylistView extends Component {
  setBackgroundImage = url => {
    Vibrant.from(url)
      .getPalette()
      .then(palette => {
        let rgb = palette.DarkMuted._rgb.join(', ');
        let color = 'rgb(' + rgb + ')';
        let bgImage = `linear-gradient(${color}, rgb(6, 9, 10) 85%)`;
        this.props.setBackgroundImage(bgImage);
      });
  };

  playSongHandler = (track, playlist) => {
    if (track) {
      let uris;
      if (track.type === 'playlist') {
        uris = JSON.stringify({
          context_uri: playlist.uri
        });
      } else {
        uris = JSON.stringify({
          context_uri: playlist.uri,
          offset: {
            uri: track.uri
          }
        });
      }
      this.props.playSong(uris);
    }
  };

  changeTitle = playlistName => {
    document.title = 'React Spotify | ' + playlistName;
  };

  render() {
    return (
      <Playlist id={this.props.match.params.id}>
        {playlist =>
          playlist ? (
            <Grid container>
              <Grid item xs={12} md={4}>
                <div style={{ textAlign: 'center' }}>
                  <img
                    src={playlist.images[0].url}
                    style={{
                      width: '70%',
                      height: '70%',
                      display: 'block',
                      margin: '30px auto'
                    }}
                    alt="Playlist"
                    onLoad={() => {
                      this.changeTitle(playlist.name);
                      this.setBackgroundImage(playlist.images[0].url);
                    }}
                  />
                  <Typography variant="h6">{playlist.name}</Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    {playlist.owner.display_name}
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    {playlist.tracks.items.length + ' songs'}
                  </Typography>
                  <Button
                    color="primary"
                    onClick={() => this.playSongHandler(playlist)}
                  >
                    Play
                  </Button>
                </div>
              </Grid>
              <Grid item xs={12} md={8}>
                <List style={{ width: '100%' }}>
                  {playlist.tracks.items.map(track => {
                    let ArtistAlbumLink = (
                      <React.Fragment>
                        {track.track.artists.map((artist, index) => (
                          <React.Fragment key={artist.id}>
                            <TrackDetailsLink to={`/artist/${artist.id}`}>
                              {artist.name}
                            </TrackDetailsLink>
                            {index !== track.track.artists.length - 1
                              ? ', '
                              : null}
                          </React.Fragment>
                        ))}
                        <span> • </span>
                        <TrackDetailsLink to={`/album/${track.track.album.id}`}>
                          {track.track.album.name}
                        </TrackDetailsLink>
                      </React.Fragment>
                    );
                    return (
                      <ListItem
                        key={track.track.id}
                        style={
                          this.props.currentlyPlaying === track.track.name &&
                          this.props.isPlaying
                            ? {
                                background: '#1db954'
                              }
                            : null
                        }
                      >
                        <ListItemIcon
                          style={{
                            cursor: 'pointer'
                          }}
                        >
                          {this.props.currentlyPlaying === track.track.name &&
                          this.props.isPlaying ? (
                            <PauseIcon onClick={this.props.pauseSong} />
                          ) : (
                            <PlayArrowIcon
                              onClick={() =>
                                this.playSongHandler(track.track, playlist)
                              }
                            />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={track.track.name}
                          secondary={ArtistAlbumLink}
                        >
                          {track.track.name}
                        </ListItemText>
                      </ListItem>
                    );
                  })}
                </List>
              </Grid>
            </Grid>
          ) : null
        }
      </Playlist>
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
  )(PlaylistView)
);
