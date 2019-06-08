import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Button,
  Drawer,
  Avatar,
  withWidth,
  Paper,
  Divider,
  ListItemAvatar
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import SpotifyIcon from './spotify.svg';
import GithubIcon from './github.svg';
import HomeIcon from '@material-ui/icons/Home';
import SearchIcon from '@material-ui/icons/Search';
import LibraryMusicIcon from '@material-ui/icons/LibraryMusic';

const Sidedrawer = props => {
  let { recently_played } = props;
  if (recently_played) {
    recently_played = recently_played.slice(0, 5).map(track => {
      return (
        <ListItem
          key={track.played_at}
          button
          component={Link}
          to={`/album/${track.track.album.id}`}
          style={{
            height: 64
          }}
        >
          <ListItemIcon>
            <Avatar src={track.track.album.images[0].url} />
          </ListItemIcon>
          <ListItemText>
            <Typography
              variant="subtitle1"
              style={{
                fontSize: 13,
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden'
              }}
            >
              {track.track.album.name}
            </Typography>
            <Typography
              variant="caption"
              style={{
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden'
              }}
            >
              album
            </Typography>
          </ListItemText>
        </ListItem>
      );
    });
  }

  let mainList = (
    <List>
      <ListItem button component={Link} to="/search">
        <ListItemIcon>
          <SearchIcon />
        </ListItemIcon>
        <ListItemText>Search</ListItemText>
      </ListItem>
      <ListItem button component={Link} to="/browse/featured">
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText>Home</ListItemText>
      </ListItem>
      <ListItem button component={Link} to="/library/playlists">
        <ListItemIcon>
          <LibraryMusicIcon />
        </ListItemIcon>
        <ListItemText>My Library</ListItemText>
      </ListItem>

      <Divider />
      <ListItem>
        <Typography variant="caption">Recently Played</Typography>
      </ListItem>
      {recently_played}
    </List>
  );

  let mainContent = (
    <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <Button
        style={{ margin: 20, position: 'fixed', zIndex: 1000 }}
        variant="contained"
        color="primary"
        onClick={props.toggleDrawer}
      >
        <MenuIcon />
      </Button>
      <Drawer
        anchor="left"
        open={props.open}
        onClick={props.toggleDrawer}
        onClose={props.toggleDrawer}
      >
        {mainList}
      </Drawer>
    </div>
  );

  if (props.width === 'lg' || props.width === 'xl') {
    mainContent = (
      <Paper
        style={{
          height: '100%',
          width: 255,
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }}
      >
        {mainList}
        <div
          style={{
            position: 'absolute',
            top: '73%',
            left: 0,
            width: '100%'
          }}
        >
          <a
            href="https://www.spotify.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <ListItem button>
              <ListItemAvatar>
                <Avatar src={SpotifyIcon} style={{ width: 25, height: 25 }} />
              </ListItemAvatar>
              <ListItemText secondary="Spotify.com" />
            </ListItem>
          </a>
          <a
            href="https://www.github.com/idanlo/react-spotify"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <ListItem button>
              <ListItemAvatar>
                <Avatar
                  src={GithubIcon}
                  style={{
                    width: 25,
                    height: 25
                  }}
                />
              </ListItemAvatar>
              <ListItemText secondary="Github Repo" />
            </ListItem>
          </a>
        </div>
      </Paper>
    );
  }

  return mainContent;
};

const mapStateToProps = state => {
  return {
    recently_played: state.recently_played
  };
};

export default connect(mapStateToProps)(withWidth()(Sidedrawer));
