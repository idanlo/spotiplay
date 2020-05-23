import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { playSong, pauseSong } from '../../../store/actions/actionTypes';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import InfiniteList from 'react-virtualized/dist/commonjs/List';
import InfiniteLoader from 'react-virtualized/dist/commonjs/InfiniteLoader';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import WindowScroller from 'react-virtualized/dist/commonjs/WindowScroller';
import {
  Grid,
  CircularProgress,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@material-ui/core';
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import { TrackDetailsLink } from '../../UI';
import { milisToMinutesAndSeconds } from '../../../utils';

const Tracks = () => {
  const { query } = useParams();
  const { currentlyPlaying, isPlaying } = useSelector(state => ({
    currentlyPlaying: state.currently_playing,
    isPlaying: state.isPlaying,
  }));
  const dispatch = useDispatch();
  const [tracks, setTracks] = React.useState(null);

  React.useEffect(() => {
    axios
      .get('https://api.spotify.com/v1/search', {
        params: {
          type: 'track',
          limit: 50,
          q: query,
        },
      })
      .then(res => {
        setTracks(res.data.tracks);
      });
  }, []);

  function loadMoreData() {
    if (tracks && tracks.next) {
      axios
        .get(tracks.next, {
          params: {
            type: 'track',
            limit: 50,
          },
        })
        .then(res => {
          setTracks({
            ...tracks,
            items: tracks.items.concat(res.data.tracks.items),
          });
        });
    }
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <div
          style={{
            // For some reason the scrolling doesn't work when there is no height
            height: 50,
          }}
        >
          {tracks && tracks.items && tracks.items.length ? (
            <AutoSizer>
              {({ width }) => (
                <WindowScroller>
                  {({ height, isScrolling, onChildScroll, scrollTop }) => (
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

                            if (
                              !(!tracks.next || index < tracks.items.length)
                            ) {
                              content = 'Loading...';
                            } else {
                              const track = tracks.items[index];
                              const ArtistAlbumLink = (
                                <React.Fragment>
                                  {track.artists.map((artist, index) => (
                                    <React.Fragment key={artist.id}>
                                      <TrackDetailsLink
                                        to={'/artist/' + artist.id}
                                      >
                                        {artist.name}
                                      </TrackDetailsLink>
                                      {index !== track.artists.length - 1
                                        ? ', '
                                        : null}
                                    </React.Fragment>
                                  ))}
                                  <span> • </span>
                                  <TrackDetailsLink
                                    to={'/album/' + track.album.id}
                                  >
                                    {track.album.name}
                                  </TrackDetailsLink>
                                </React.Fragment>
                              );
                              content = (
                                <ListItem
                                  key={track.id}
                                  style={
                                    currentlyPlaying === track.name && isPlaying
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
                                    {currentlyPlaying === track.name &&
                                    isPlaying ? (
                                      <PauseIcon
                                        onClick={() => dispatch(pauseSong())}
                                      />
                                    ) : (
                                      <PlayArrowIcon
                                        onClick={() =>
                                          dispatch(
                                            playSong(
                                              JSON.stringify({
                                                context_uri: track.album.uri,
                                                offset: {
                                                  uri: track.uri,
                                                },
                                              })
                                            )
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
                                    primary={milisToMinutesAndSeconds(
                                      track.duration_ms
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
                  )}
                </WindowScroller>
              )}
            </AutoSizer>
          ) : (
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
          )}
        </div>
      </Grid>
    </Grid>
  );
};

export default Tracks;
