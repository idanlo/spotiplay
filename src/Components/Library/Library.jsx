import React from 'react';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions/actionTypes';
import { Switch, Route } from 'react-router-dom';
import InfiniteList from 'react-virtualized/dist/commonjs/List';
import InfiniteLoader from 'react-virtualized/dist/commonjs/InfiniteLoader';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import WindowScroller from 'react-virtualized/dist/commonjs/WindowScroller';
import { UserTracks, UserAlbums, UserPlaylists } from 'react-spotify-api';
import { Grid, ListItem, ListItemText, ListItemIcon } from '@material-ui/core';
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import Navigation from '../Navigation/Navigation';
import MediaCard from '../MediaCard/MediaCard';
import { TrackDetailsLink } from '../UI';
import { milisToMinutesAndSeconds } from '../../utils';

const NavigationItems = [
  {
    link: '/library/playlists',
    text: 'Playlists',
  },
  {
    link: '/library/albums',
    text: 'Albums',
  },
  {
    link: '/library/tracks',
    text: 'Tracks',
  },
];

const Library = props => {
  React.useEffect(() => {
    document.title = 'Spotiplay | Library';
  }, []);

  let savedPlaylists = (
    <UserPlaylists>
      {({ data: playlists }) =>
        playlists ? (
          <Grid container spacing={2} style={{ margin: 0, width: '100%' }}>
            {playlists.items.map(playlist => (
              <MediaCard
                key={playlist.id}
                link={`/playlist/${playlist.id}`}
                img={playlist.images.length > 0 ? playlist.images[0].url : null}
                primaryText={playlist.name}
                secondaryText={
                  playlist.description ||
                  (playlist.owner.display_name
                    ? `By ${playlist.owner.display_name}`
                    : null) ||
                  ''
                } // Playlist description is optional
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
        ) : null
      }
    </UserPlaylists>
  );

  let savedAlbums = (
    <UserAlbums>
      {({ data: albums }) =>
        albums ? (
          <Grid container spacing={2} style={{ margin: 0, width: '100%' }}>
            {albums.items.map(album => (
              <MediaCard
                key={album.album.id}
                link={`/album/${album.album.id}`}
                img={album.album.images[0].url}
                content={album.album.name}
                primaryText={album.album.name}
                secondaryText={album.album.artists.map(a => a.name).join(', ')}
                playSong={() =>
                  props.playSong(
                    JSON.stringify({
                      context_uri: album.album.uri,
                    })
                  )
                }
              />
            ))}
          </Grid>
        ) : null
      }
    </UserAlbums>
  );

  let savedTracks = (
    <AutoSizer>
      {({ width }) => (
        <WindowScroller>
          {({ height, isScrolling, onChildScroll, scrollTop }) => (
            <UserTracks>
              {({ data: tracks, loadMoreData }) =>
                tracks ? (
                  <InfiniteLoader
                    isRowLoaded={({ index }) =>
                      !tracks.next || index < tracks.items.length
                    }
                    loadMoreRows={() => {
                      loadMoreData();
                    }}
                    rowCount={
                      tracks.items.length === tracks.total
                        ? tracks.items.length
                        : tracks.items.length + 1
                    }
                  >
                    {({ onRowsRendered, registerChild }) => (
                      <InfiniteList
                        style={{ outline: 'none', paddingBottom: 100 }}
                        ref={registerChild}
                        onRowsRendered={onRowsRendered}
                        autoHeight
                        height={height}
                        onScroll={onChildScroll}
                        isScrolling={isScrolling}
                        width={width}
                        scrollTop={scrollTop}
                        rowHeight={72}
                        rowCount={
                          tracks.items.length === tracks.total
                            ? tracks.items.length
                            : tracks.items.length + 1
                        }
                        rowRenderer={({ index, key, style }) => {
                          let content = null;

                          if (!(!tracks.next || index < tracks.items.length)) {
                            content = 'Loading...';
                          } else {
                            const track = tracks.items[index];
                            const ArtistAlbumLink = (
                              <React.Fragment>
                                {track.track.artists.map((artist, index) => (
                                  <React.Fragment key={artist.id}>
                                    <TrackDetailsLink
                                      to={'/artist/' + artist.id}
                                    >
                                      {artist.name}
                                    </TrackDetailsLink>
                                    {index !== track.track.artists.length - 1
                                      ? ', '
                                      : null}
                                  </React.Fragment>
                                ))}
                                <span> • </span>
                                <TrackDetailsLink
                                  to={'/album/' + track.track.album.id}
                                >
                                  {track.track.album.name}
                                </TrackDetailsLink>
                              </React.Fragment>
                            );
                            content = (
                              <ListItem
                                key={track.track.id}
                                style={
                                  props.currentlyPlaying === track.track.name &&
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
                                  {props.currentlyPlaying ===
                                    track.track.name && props.isPlaying ? (
                                    <PauseIcon onClick={props.pauseSong} />
                                  ) : (
                                    <PlayArrowIcon
                                      onClick={() =>
                                        props.playSong(
                                          JSON.stringify({
                                            context_uri: track.track.album.uri,
                                            offset: {
                                              uri: track.track.uri,
                                            },
                                          })
                                        )
                                      }
                                    />
                                  )}
                                </ListItemIcon>
                                <ListItemText
                                  primary={track.track.name}
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
                                  primary={milisToMinutesAndSeconds(
                                    track.track.duration_ms
                                  )}
                                />
                              </ListItem>
                            );
                          }

                          return (
                            <div key={key} style={style}>
                              {content}
                            </div>
                          );
                        }}
                      />
                    )}
                  </InfiniteLoader>
                ) : null
              }
            </UserTracks>
          )}
        </WindowScroller>
      )}
    </AutoSizer>
  );

  return (
    <Grid container>
      <Navigation items={NavigationItems} />
      <Grid item xs={12}>
        <div
          style={{
            // For some reason the scrolling doesn't work when there is no height
            height: 50,
          }}
        >
          <Switch>
            <Route path="/library/playlists" render={() => savedPlaylists} />
            <Route path="/library/albums" render={() => savedAlbums} />
            <Route path="/library/tracks" render={() => savedTracks} />
          </Switch>
        </div>
      </Grid>
    </Grid>
  );
};

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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Library);
