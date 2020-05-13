import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import * as actionTypes from '../../store/actions/actionTypes';
import { Artist, ArtistTracks, ArtistAlbums } from 'react-spotify-api';
import { connect } from 'react-redux';
import Vibrant from 'node-vibrant';
import {
  Grid,
  Typography,
  Button,
  List,
  Avatar,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import { TrackDetailsLink } from '../UI';
import MediaCard from '../MediaCard/MediaCard';
import { ReactComponent as NoProfile } from '../MediaCard/NoProfile.svg';
import { milisToMinutesAndSeconds } from '../../utils';

class ArtistView extends Component {
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

  playSongHandler = track => {
    if (track) {
      let uris;
      if (track.type === 'artist') {
        uris = JSON.stringify({
          context_uri: track.uri,
        });
      } else {
        // track.type === "track"
        uris = JSON.stringify({
          context_uri: track.album.uri,
          offset: {
            uri: track.uri,
          },
        });
      }
      this.props.playSong(uris);
    }
  };

  changeTitle = artistName => {
    document.title = 'Spotiplay | ' + artistName;
  };

  render() {
    let ArtistHeader = (
      <Artist id={this.props.match.params.id}>
        {({ data: artist }) =>
          artist ? (
            <Grid item xs={12} style={{ width: '100%', marginTop: 10 }}>
              <div style={{ textAlign: 'center' }}>
                {artist.images && artist.images.length ? (
                  <Avatar
                    src={artist.images[0].url}
                    onLoad={() => {
                      this.changeTitle(artist.name);
                      this.changeBackgroundImageHandler(artist.images[0].url);
                    }}
                    style={{
                      margin: '0 auto',
                      width: 300,
                      height: 300,
                      marginBottom: 10,
                    }}
                  />
                ) : (
                  <div
                    style={{
                      margin: '0 auto',
                      width: 300,
                      height: 300,
                      marginBottom: 10,
                      background: 'gray',
                      borderRadius: '50%',
                    }}
                  >
                    <NoProfile width={300} height={300} />
                  </div>
                )}
                <Typography variant="h6">{artist.name}</Typography>
                <Button
                  color="primary"
                  onClick={() => this.playSongHandler(artist)}
                >
                  Play
                </Button>
              </div>
            </Grid>
          ) : null
        }
      </Artist>
    );

    let ArtistTopTracksList = (
      <ArtistTracks id={this.props.match.params.id}>
        {({ data: tracks }) =>
          tracks ? (
            <List style={{ width: '100%' }}>
              {tracks.tracks.map(track => {
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
                    <TrackDetailsLink to={'/album/' + track.album.id}>
                      {track.album.name}
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
                            background: '#1db954',
                          }
                        : null
                    }
                  >
                    <ListItemIcon
                      style={{
                        cursor: 'pointer',
                      }}
                    >
                      {this.props.currentlyPlaying === track.name &&
                      this.props.isPlaying ? (
                        <PauseIcon onClick={this.props.pauseSong} />
                      ) : (
                        <PlayArrowIcon
                          onClick={() =>
                            this.props.playSong(
                              JSON.stringify({
                                context_uri: track.album.uri,
                                offset: {
                                  uri: track.uri,
                                },
                              })
                            )
                          }
                        />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={track.name}
                      secondary={ArtistAlbumLink}
                      primaryTypographyProps={{
                        style: { fontWeight: 'bold' },
                      }}
                      style={{ fontWeight: 'bold' }}
                    />
                    <ListItemText
                      style={{
                        textAlign: 'right',
                      }}
                      primary={milisToMinutesAndSeconds(track.duration_ms)}
                    />
                  </ListItem>
                );
              })}
            </List>
          ) : null
        }
      </ArtistTracks>
    );

    let ArtistTopAlbums = (
      <ArtistAlbums id={this.props.match.params.id}>
        {({ data: albums }) =>
          albums ? (
            <Grid container spacing={2} style={{ margin: 0, width: '100%' }}>
              {albums.items.map(album => (
                <MediaCard
                  key={album.id}
                  link={'/album/' + album.id}
                  img={album.images.length > 0 ? album.images[0].url : null}
                  primaryText={album.name}
                  secondaryText={album.artists.map(a => a.name).join(', ')}
                  playSong={() =>
                    this.props.playSong(
                      JSON.stringify({
                        context_uri: album.uri,
                      })
                    )
                  }
                />
              ))}
            </Grid>
          ) : null
        }
      </ArtistAlbums>
    );

    return (
      <Grid container>
        {ArtistHeader}
        {ArtistTopTracksList}
        {ArtistTopAlbums}
      </Grid>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.current_user,
    currentlyPlaying: state.currently_playing,
    isPlaying: state.isPlaying,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    playSong: uris => dispatch(actionTypes.playSong(uris)),
    pauseSong: () => dispatch(actionTypes.pauseSong()),
    setBackgroundImage: backgroundImage =>
      dispatch({
        type: actionTypes.SET_BACKGROUND_IMAGE,
        backgroundImage,
      }),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ArtistView)
);
