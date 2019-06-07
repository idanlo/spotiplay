import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { Grid, Typography } from '@material-ui/core';
import MediaCard from '../MediaCard/MediaCard';
import { BrowseFeatured, BrowseCategories, BrowseNew } from 'react-spotify-api';
import * as actionTypes from '../../store/actions/actionTypes';
import Navigation from '../Navigation/Navigation';
import styled from 'styled-components';

const TypographyHeader = styled(Typography).attrs({
  variant: 'h3',
  align: 'center',
  color: 'secondary'
})`
  padding: 10px;
`;

class HomePage extends Component {
  componentDidMount() {
    this.props.setBackgroundImage(
      'linear-gradient(rgb(58, 91, 95), rgb(6, 9, 10) 85%)'
    );
    document.title = 'React Spotify | Home';
  }

  render() {
    const NavigationItems = [
      {
        link: '/browse/featured',
        text: 'Featured'
      },
      {
        link: '/browse/genres',
        text: 'Genres & Moods'
      },
      {
        link: '/browse/new',
        text: 'New Releases'
      },
      {
        link: '/browse/discover',
        text: 'Discover'
      }
    ];

    let recentlyPlayed = null;
    if (this.props.recently_played) {
      recentlyPlayed = this.props.recently_played.map(track => {
        let artist = track.track.artists.map(name => name.name).join(', ');
        return (
          <MediaCard
            key={`${track.track.id} - ${track.played_at}`} // There is a problem with the artist id only because some recently played songs appear couple of times so they key isn't unique
            link={'/album/' + track.track.album.id}
            img={track.track.album.images[0].url}
            content={`${artist} - ${track.track.name}`}
            playSong={() =>
              this.props.playSong(
                JSON.stringify({
                  context_uri: track.track.album.uri,
                  offset: {
                    uri: track.track.uri
                  }
                })
              )
            }
          />
        );
      });

      recentlyPlayed = (
        <div>
          <TypographyHeader>Recently Played</TypographyHeader>
          <Grid
            container
            spacing={16}
            style={{ margin: 0, width: '100%' }} // inline styles overwrite the material ui styles (no spacing on the left side)
          >
            {recentlyPlayed}
          </Grid>
        </div>
      );
    }

    let featuredPlaylists = (
      <BrowseFeatured options={{ limit: 12 }}>
        {playlists =>
          playlists ? (
            <div>
              <TypographyHeader>{playlists.message}</TypographyHeader>
              <Grid container spacing={16} style={{ margin: 0, width: '100%' }}>
                {playlists.playlists.items.map(playlist => (
                  <MediaCard
                    key={playlist.id}
                    link={`/playlist/${playlist.id}`}
                    img={playlist.images[0].url}
                    content={playlist.name}
                    playSong={() =>
                      this.props.playSong(
                        JSON.stringify({
                          context_uri: playlist.uri
                        })
                      )
                    }
                  />
                ))}
              </Grid>
            </div>
          ) : null
        }
      </BrowseFeatured>
    );

    let genres = (
      <div>
        <TypographyHeader>Genres & Moods</TypographyHeader>
        <Grid container spacing={16} style={{ margin: 0, width: '100%' }}>
          <BrowseCategories options={{ limit: 18 }}>
            {categories =>
              categories
                ? categories.categories.items.map(genre => (
                    <MediaCard
                      link={`/genre/${genre.id}`}
                      key={genre.id}
                      img={genre.icons[0].url}
                      content={genre.name}
                    />
                  ))
                : null
            }
          </BrowseCategories>
        </Grid>
      </div>
    );

    let newReleases = (
      <div>
        <TypographyHeader>New Releases</TypographyHeader>
        <Grid container spacing={16} style={{ margin: 0, width: '100%' }}>
          <BrowseNew options={{ limit: 18 }}>
            {albums =>
              albums
                ? albums.albums.items.map(album => (
                    <MediaCard
                      link={`/album/${album.id}`}
                      key={album.id}
                      img={album.images[0].url}
                      content={album.name}
                      playSong={() =>
                        this.props.playSong(
                          JSON.stringify({
                            context_uri: album.uri
                          })
                        )
                      }
                    />
                  ))
                : null
            }
          </BrowseNew>
        </Grid>
      </div>
    );

    return (
      <Grid container>
        <Navigation items={NavigationItems} />
        <Switch>
          <Route
            path="/browse/featured"
            exact
            render={() => (
              <div>
                {recentlyPlayed}
                {featuredPlaylists}
              </div>
            )}
          />
          <Route path="/browse/genres" exact render={() => genres} />
          <Route path="/browse/new" exact render={() => newReleases} />
          <Route path="/browse/discover" exact render={() => recentlyPlayed} />
        </Switch>
      </Grid>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.current_user,
    recently_played: state.recently_played
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setBackgroundImage: backgroundImage =>
      dispatch({
        type: actionTypes.SET_BACKGROUND_IMAGE,
        backgroundImage
      }),
    playSong: uris => dispatch(actionTypes.playSong(uris))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage);
