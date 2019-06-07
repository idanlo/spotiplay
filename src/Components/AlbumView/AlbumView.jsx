import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import * as actionTypes from '../../store/actions/actionTypes';
import { connect } from 'react-redux';
import axios from 'axios';
import { Album } from 'react-spotify-api';
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
import PauseIcon from '@material-ui/icons/Pause';
import { TrackDetailsLink } from '../UI/TrackDetailsLink';
import { milisToMinutesAndSeconds } from '../../utils/index';

class AlbumView extends Component {
  state = {
    isAlbumSaved: false
  };

  changeBackgroundImageHandler = img => {
    Vibrant.from(img)
      .getPalette()
      .then(palette => {
        let rgb = palette.DarkMuted._rgb.join(', ');
        let color = 'rgb(' + rgb + ')';
        let bgImage = `linear-gradient(${color}, rgb(6, 9, 10) 85%)`;
        this.props.setBackgroundImage(bgImage);
      });
  };

  componentDidMount() {
    this.checkIsAlbumSaved();
  }

  changeTitle = albumName => {
    document.title = 'React Spotify | ' + albumName;
  };

  checkIsAlbumSaved = () => {
    if (this.props.user.access_token && this.props.match.params.id) {
      axios
        .get('https://api.spotify.com/v1/me/albums/contains', {
          params: {
            ids: this.props.match.params.id
          },
          headers: {
            Authorization: `Bearer ${this.props.user.access_token}`
          }
        })
        .then(res => {
          this.setState({ isAlbumSaved: res.data[0] });
        });
    }
  };

  saveAlbum = () => {
    if (this.props.user.access_token && this.props.match.params.id) {
      axios({
        method: 'PUT',
        url: `https://api.spotify.com/v1/me/albums?ids=${
          this.props.match.params.id
        }`,
        headers: {
          Authorization: `Bearer ${this.props.user.access_token}`
        }
      }).then(() => {
        this.setState({ isAlbumSaved: true });
      });
    }
  };

  playSongHandler = (track, album) => {
    if (track) {
      let uris;
      if (track.type === 'album') {
        uris = JSON.stringify({
          context_uri: track.uri
        });
      } else {
        uris = JSON.stringify({
          context_uri: album.uri,
          offset: {
            uri: track.uri
          }
        });
      }
      this.props.playSong(uris);
    }
  };

  render() {
    let mainContent = (
      <Album id={this.props.match.params.id}>
        {album =>
          album ? (
            <Grid container>
              <Grid item xs={12} md={4}>
                <div style={{ textAlign: 'center' }}>
                  <img
                    src={album.images[0].url}
                    style={{
                      width: '70%',
                      height: '70%',
                      display: 'block',
                      margin: '30px auto'
                    }}
                    alt="Album"
                    onLoad={() => {
                      this.changeTitle(album.name);
                      this.changeBackgroundImageHandler(album.images[0].url);
                    }}
                  />
                  <Typography variant="h6">{album.name}</Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    {album.artists.map(artist => artist.name).join(', ')}
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    {album.release_date.substring(0, 4) +
                      ' • ' +
                      album.tracks.items.length +
                      ' songs'}
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
                    onClick={() => this.playSongHandler(album)}
                  >
                    Play
                  </Button>
                </div>
              </Grid>
              <Grid item xs={12} md={8}>
                <List style={{ width: '100%' }}>
                  {album.tracks.items.map(track => {
                    const ArtistAlbumLink = (
                      <React.Fragment>
                        {track.artists.map((artist, index) => (
                          <React.Fragment key={artist.id}>
                            <TrackDetailsLink to={'/artist/' + artist.id}>
                              {artist.name}
                            </TrackDetailsLink>
                            {index !== track.artists.length - 1 ? ', ' : null}
                          </React.Fragment>
                        ))}
                        <span> • </span>
                        <TrackDetailsLink to={'/album/' + album.id}>
                          {album.name}
                        </TrackDetailsLink>
                      </React.Fragment>
                    );
                    return (
                      <ListItem
                        key={track.id}
                        style={
                          this.props.currentlyPlaying === track.name &&
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
                          {this.props.currentlyPlaying === track.name &&
                          this.props.isPlaying ? (
                            <PauseIcon onClick={this.props.pauseSong} />
                          ) : (
                            <PlayArrowIcon
                              onClick={() => this.playSongHandler(track, album)}
                            />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={track.name}
                          secondary={ArtistAlbumLink}
                        />
                        <ListItemText
                          style={{
                            textAlign: 'right'
                          }}
                          primary={milisToMinutesAndSeconds(track.duration_ms)}
                        />
                      </ListItem>
                    );
                  })}
                </List>
              </Grid>
            </Grid>
          ) : null
        }
      </Album>
    );
    return mainContent;
  }
}

const mapStateToProps = state => {
  return {
    currentlyPlaying: state.currently_playing,
    isPlaying: state.isPlaying,
    user: state.current_user
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
  )(AlbumView)
);
