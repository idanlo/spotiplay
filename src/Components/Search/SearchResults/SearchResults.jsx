import React from 'react';
import { withRouter, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
} from '@material-ui/core';
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import { useSearch } from 'react-spotify-api';
import * as actionTypes from '../../../store/actions/actionTypes';
import Navigation from '../../Navigation/Navigation';
import MediaCard from '../../MediaCard/MediaCard';
import { TrackDetailsLink } from '../../UI/TrackDetailsLink';
import { milisToMinutesAndSeconds } from '../../../utils/index';

const searchOpts = {
  album: true,
  artist: true,
  playlist: true,
  track: true,
};

function SearchResults(props) {
  const NavigationItems = [
    {
      link: '/search/results/' + props.match.params.query,
      text: 'Top Reults',
    },
    {
      link: '/search/artists/' + props.match.params.query,
      text: 'Artists',
    },
    {
      link: '/search/tracks/' + props.match.params.query,
      text: 'Tracks',
    },
    {
      link: '/search/albums/' + props.match.params.query,
      text: 'Albums',
    },
    {
      link: '/search/playlists/' + props.match.params.query,
      text: 'Playlists',
    },
  ];

  const { data, loading } = useSearch(props.match.params.query, searchOpts);

  let TopResults =
    data && data.artists && data.tracks && data.albums ? (
      <Grid container>
        {data.artists.items.length > 0 && data.tracks.items.length > 0 ? (
          <Grid container spacing={2} style={{ margin: 0, width: '100%' }}>
            <MediaCard
              rounded
              link={'/artist/' + data.artists.items[0].id}
              img={
                data.artists.items[0].images.length > 0
                  ? data.artists.items[0].images[0].url
                  : null
              }
              content={data.artists.items[0].name}
              playSong={() =>
                props.playSong(
                  JSON.stringify({
                    context_uri: data.artists.items[0].uri,
                  })
                )
              }
            />
            <Grid item xs={12} sm={6} md={10}>
              <List>
                {data.tracks.items.slice(0, 6).map(track => {
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
                        props.currentlyPlaying === track.name && props.isPlaying
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
                        {props.currentlyPlaying === track.name &&
                        props.isPlaying ? (
                          <PauseIcon onClick={props.pauseSong} />
                        ) : (
                          <PlayArrowIcon
                            onClick={() =>
                              props.playSong(
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
            </Grid>
          </Grid>
        ) : null}
        {data.artists.items.length > 0 ? (
          <div style={{ width: '100%' }}>
            <Typography
              style={{ padding: 10 }}
              color="secondary"
              variant="h6"
              align="center"
            >
              Artists
            </Typography>
            <Grid container spacing={2} style={{ margin: 0, width: '100%' }}>
              {data.artists.items.slice(0, 6).map(artist => (
                <MediaCard
                  rounded
                  key={artist.id}
                  link={'/artist/' + artist.id}
                  img={artist.images.length > 0 ? artist.images[0].url : null}
                  content={artist.name}
                  playSong={() =>
                    props.playSong(
                      JSON.stringify({
                        context_uri: artist.uri,
                      })
                    )
                  }
                />
              ))}
            </Grid>
          </div>
        ) : null}
        {data.albums.items.length > 0 ? (
          <div style={{ width: '100%' }}>
            <Typography
              style={{ padding: 10 }}
              color="secondary"
              variant="h6"
              align="center"
            >
              Albums
            </Typography>
            <Grid container spacing={2} style={{ margin: 0, width: '100%' }}>
              {data.albums.items.slice(0, 6).map(album => (
                <MediaCard
                  key={album.id}
                  link={'/album/' + album.id}
                  img={album.images.length > 0 ? album.images[0].url : null}
                  content={`${album.artists.map(a => a.name).join(', ')} - ${
                    album.name
                  }`}
                  playSong={() =>
                    props.playSong(
                      JSON.stringify({
                        context_uri: album.uri,
                      })
                    )
                  }
                />
              ))}
            </Grid>
          </div>
        ) : null}
      </Grid>
    ) : null;

  let Artists =
    data && data.artists ? (
      <Grid container spacing={2} style={{ margin: 0, width: '100%' }}>
        {data.artists.items.map(artist => (
          <MediaCard
            rounded
            key={artist.id}
            link={'/album/' + artist.id}
            img={artist.images.length > 0 ? artist.images[0].url : null}
            content={artist.name}
            playSong={() =>
              props.playSong(
                JSON.stringify({
                  context_uri: artist.uri,
                })
              )
            }
          />
        ))}
      </Grid>
    ) : null;

  let Tracks =
    data && data.tracks ? (
      <List style={{ width: '100%' }}>
        {data.tracks.items.map(track => {
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
                props.currentlyPlaying === track.name && props.isPlaying
                  ? { background: '#1db954' }
                  : null
              }
            >
              <ListItemIcon style={{ cursor: 'pointer' }}>
                {props.currentlyPlaying === track.name && props.isPlaying ? (
                  <PauseIcon onClick={props.pauseSong} />
                ) : (
                  <PlayArrowIcon
                    onClick={() =>
                      props.playSong(
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
              <ListItemText primary={track.name} secondary={ArtistAlbumLink} />
              <ListItemText
                style={{ textAlign: 'right' }}
                primary={milisToMinutesAndSeconds(track.duration_ms)}
              />
            </ListItem>
          );
        })}
      </List>
    ) : null;

  let Albums =
    data && data.albums ? (
      <Grid container spacing={2} style={{ margin: 0, width: '100%' }}>
        {data.albums.items.map(album => (
          <MediaCard
            key={album.id}
            link={'/album/' + album.id}
            img={album.images.length > 0 ? album.images[0].url : null}
            content={`${album.artists.map(a => a.name).join(', ')} - ${
              album.name
            }`}
            playSong={() =>
              props.playSong(
                JSON.stringify({
                  context_uri: album.uri,
                })
              )
            }
          />
        ))}
      </Grid>
    ) : null;

  let Playlists =
    data && data.playlists ? (
      <Grid container spacing={2} style={{ margin: 0, width: '100%' }}>
        {data.playlists.items.map(playlist => (
          <MediaCard
            key={playlist.id}
            link={'/playlist/' + playlist.id}
            img={playlist.images.length > 0 ? playlist.images[0].url : null}
            content={playlist.name}
            playSong={() =>
              props.playSong(
                JSON.stringify({
                  context_uri: playlist.uri,
                })
              )
            }
          />
        ))}
      </Grid>
    ) : null;

  return (
    <Grid container style={{ width: '100%', margin: 0 }}>
      {loading ? (
        <Grid
          container
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
          }}
        >
          <CircularProgress />
        </Grid>
      ) : (
        <>
          <Navigation items={NavigationItems} width="60%" />
          <Switch>
            <Route path="/search/results/:query" exact>
              {TopResults}
            </Route>
            <Route path="/search/artists/:query" exact>
              {Artists}
            </Route>
            <Route path="/search/tracks/:query" exact>
              {Tracks}
            </Route>
            <Route path="/search/albums/:query" exact>
              {Albums}
            </Route>
            <Route path="/search/playlists/:query" exact>
              {Playlists}
            </Route>
          </Switch>
        </>
      )}
    </Grid>
  );
}

const mapStateToProps = state => {
  return {
    currentlyPlaying: state.currently_playing,
    isPlaying: state.isPlaying,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setPlayNow: (uri, uri_type) =>
      dispatch({ type: actionTypes.SET_PLAY_NOW, uri, uri_type }),
    pauseSong: () => dispatch(actionTypes.pauseSong()),
    playSong: uris => dispatch(actionTypes.playSong(uris)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SearchResults)
);
