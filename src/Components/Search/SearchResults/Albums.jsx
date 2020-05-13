import React from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useSearch } from 'react-spotify-api';
import { playSong } from '../../../store/actions/actionTypes';
import { Grid, CircularProgress } from '@material-ui/core';
import MediaCard from '../../MediaCard/MediaCard';

const Albums = () => {
  const { query } = useParams();
  const dispatch = useDispatch();
  const { data } = useSearch(query, { type: 'album', limit: 50 });

  return (
    <Grid container>
      <Grid item xs={12}>
        <Grid container spacing={2} style={{ margin: 0, width: '100%' }}>
          {data &&
          data.albums &&
          data.albums.items &&
          data.albums.items.length ? (
            data.albums.items.map(album => (
              <MediaCard
                key={album.id}
                link={'/album/' + album.id}
                img={album.images.length > 0 ? album.images[0].url : null}
                primaryText={album.name}
                secondaryText={album.artists.map(a => a.name).join(', ')}
                playSong={() =>
                  dispatch(
                    playSong(
                      JSON.stringify({
                        context_uri: album.uri,
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

export default Albums;
