import React from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useSearch } from 'react-spotify-api';
import { playSong } from '../../../store/actions/actionTypes';
import { Grid, CircularProgress } from '@material-ui/core';
import MediaCard from '../../MediaCard/MediaCard';

const Artists = () => {
  const { query } = useParams();
  const dispatch = useDispatch();
  const { data } = useSearch(query, { type: 'artist', limit: 50 });

  return (
    <Grid container>
      <Grid item xs={12}>
        <Grid container spacing={2} style={{ margin: 0, width: '100%' }}>
          {data &&
          data.artists &&
          data.artists.items &&
          data.artists.items.length ? (
            data.artists.items.map(artist => (
              <MediaCard
                rounded
                key={artist.id}
                link={'/artist/' + artist.id}
                img={artist.images.length > 0 ? artist.images[0].url : null}
                primaryText={artist.name}
                secondaryText="Artist"
                playSong={() =>
                  dispatch(
                    playSong(
                      JSON.stringify({
                        context_uri: artist.uri,
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

export default Artists;
