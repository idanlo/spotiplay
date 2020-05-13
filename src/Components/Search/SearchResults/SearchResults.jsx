import React from 'react';
import { withRouter, Switch, Route, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  Grid,
  Typography,
  Button,
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
import MediaCard from '../../MediaCard/MediaCard';
import { TrackDetailsLink, TypographyHeader } from '../../UI';
import { milisToMinutesAndSeconds } from '../../../utils/index';
import TrackResults from './Tracks';
import ArtistResults from './Artists';
import PlaylistResults from './Playlists';
import AlbumResults from './Albums';

const searchOpts = {
  album: true,
  artist: true,
  playlist: true,
  track: true,
};

function SearchResults(props) {
  const { query } = useParams();

  const { data, loading } = useSearch(query, searchOpts);

  let TopResults =
    data && data.artists && data.tracks && data.albums ? (
      <Grid container>
        {data.artists.items.length > 0 && data.tracks.items.length > 0 ? (
          <>
            <Grid container spacing={2} style={{ margin: 0, width: '100%' }}>
              <Grid item md={2} sm={6} xs={12}>
                <TypographyHeader style={{ fontSize: 30 }}>
                  Top Result
                </TypographyHeader>
              </Grid>

              <Grid item xs={12} sm={6} md={10}>
                <TypographyHeader style={{ fontSize: 30 }}>
                  Songs
                </TypographyHeader>
              </Grid>
            </Grid>
            <Grid container spacing={2} style={{ margin: 0, width: '100%' }}>
              <MediaCard
                rounded
                link={'/artist/' + data.artists.items[0].id}
                img={
                  data.artists.items[0].images.length > 0
                    ? data.artists.items[0].images[0].url
                    : null
                }
                primaryText={data.artists.items[0].name}
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
                  {data.tracks.items.slice(0, 3).map(track => {
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
                          props.currentlyPlaying === track.name &&
                          props.isPlaying
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
                          primaryTypographyProps={{
                            style: { fontWeight: 'bold' },
                          }}
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
                  <ListItem>
                    <ListItemText>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          props.history.push('/search/' + query + '/tracks')
                        }
                      >
                        See more
                      </Button>
                    </ListItemText>
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </>
        ) : null}
      </Grid>
    ) : null;

  let Artists =
    data && data.artists ? (
      <>
        <div
          style={{
            display: 'flex',
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <TypographyHeader>Artists</TypographyHeader>
          <Button
            color="primary"
            onClick={() => props.history.push('/search/' + query + '/artists')}
          >
            <Typography style={{ marginRight: 10 }}>See more</Typography>
          </Button>
        </div>
        <Grid container spacing={2} style={{ margin: 0, width: '100%' }}>
          {data.artists.items.map(artist => (
            <MediaCard
              rounded
              key={artist.id}
              link={'/artist/' + artist.id}
              img={artist.images.length > 0 ? artist.images[0].url : null}
              primaryText={artist.name}
              secondaryText="Artist"
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
      </>
    ) : null;

  let Albums =
    data && data.albums ? (
      <>
        <div
          style={{
            display: 'flex',
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <TypographyHeader>Albums</TypographyHeader>
          <Button
            color="primary"
            onClick={() => props.history.push('/search/' + query + '/albums')}
          >
            <Typography style={{ marginRight: 10 }}>See more</Typography>
          </Button>
        </div>
        <Grid container spacing={2} style={{ margin: 0, width: '100%' }}>
          {data.albums.items.map(album => (
            <MediaCard
              key={album.id}
              link={'/album/' + album.id}
              img={album.images.length > 0 ? album.images[0].url : null}
              primaryText={album.name}
              secondaryText={album.artists.map(a => a.name).join(', ')}
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
      </>
    ) : null;

  let Playlists =
    data && data.playlists ? (
      <>
        <div
          style={{
            display: 'flex',
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <TypographyHeader>Playlists</TypographyHeader>
          <Button
            color="primary"
            onClick={() =>
              props.history.push('/search/' + query + '/playlists')
            }
          >
            <Typography style={{ marginRight: 10 }}>See more</Typography>
          </Button>
        </div>

        <Grid container spacing={2} style={{ margin: 0, width: '100%' }}>
          {data.playlists.items.map(playlist => (
            <MediaCard
              key={playlist.id}
              link={'/playlist/' + playlist.id}
              img={playlist.images.length > 0 ? playlist.images[0].url : null}
              primaryText={playlist.name}
              secondaryText="Playlist"
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
      </>
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
        <Switch>
          <Route path="/search/:query/results" exact>
            <>
              {TopResults}
              {Artists}
              {Albums}
              {Playlists}
            </>
          </Route>
          <Route path="/search/:query/artists" exact>
            <ArtistResults />
          </Route>

          <Route path="/search/:query/tracks" exact>
            <TrackResults />
          </Route>
          <Route path="/search/:query/albums" exact>
            <AlbumResults />
          </Route>
          <Route path="/search/:query/playlists" exact>
            <PlaylistResults />
          </Route>
        </Switch>
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
