import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { Typography, Grid } from '@material-ui/core';
import { BrowseCategory, BrowseCategoryPlaylists } from 'react-spotify-api';
import * as actionTypes from '../../store/actions/actionTypes';
import MediaCard from '../MediaCard/MediaCard';

const TypographyHeader = styled(Typography).attrs({
  variant: 'h3',
  align: 'center',
  color: 'secondary'
})`
  padding: 10px;
`;

const GenreView = props => {
  React.useEffect(() => {
    document.title = 'React Spotify | ' + props.match.params.id;
  }, [props.match.params.id]);
  return (
    <BrowseCategory id={props.match.params.id}>
      {genre =>
        genre ? (
          <div>
            <TypographyHeader>{genre.name}</TypographyHeader>
            <Grid container spacing={16} style={{ margin: 0, width: '100%' }}>
              <BrowseCategoryPlaylists id={props.match.params.id} playlists>
                {playlists =>
                  playlists ? (
                    playlists.playlists.items.map(playlist => (
                      <MediaCard
                        link={`/playlist/${playlist.id}`}
                        key={playlist.id}
                        img={playlist.images[0].url}
                        content={playlist.name}
                        playSong={() =>
                          props.playSong(
                            JSON.stringify({
                              context_uri: playlist.uri
                            })
                          )
                        }
                      />
                    ))
                  ) : (
                    <h1>Loading playlists for this genre</h1>
                  )
                }
              </BrowseCategoryPlaylists>
            </Grid>
          </div>
        ) : (
          <h1>Loading Genre...</h1>
        )
      }
    </BrowseCategory>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    playSong: uris => dispatch(actionTypes.playSong(uris))
  };
};

export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(GenreView)
);
