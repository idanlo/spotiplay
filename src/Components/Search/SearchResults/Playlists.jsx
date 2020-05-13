import React from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useSearch } from 'react-spotify-api';
import { Grid, CircularProgress } from '@material-ui/core';
import { playSong } from '../../../store/actions/actionTypes';
import MediaCard from '../../MediaCard/MediaCard';

const Playlists = () => {
  const { query } = useParams();
  const dispatch = useDispatch();
  const { data } = useSearch(query, { type: 'playlist', limit: 50 });

  return (
    <Grid container>
      <Grid item xs={12}>
        <Grid container spacing={2} style={{ margin: 0, width: '100%' }}>
          {data &&
          data.playlists &&
          data.playlists.items &&
          data.playlists.items.length ? (
            data.playlists.items.map(playlist => (
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
                }
                playSong={() =>
                  dispatch(
                    playSong(
                      JSON.stringify({
                        context_uri: playlist.uri,
                      })
                    )
                  )
                }
              />
            ))
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
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Playlists;
