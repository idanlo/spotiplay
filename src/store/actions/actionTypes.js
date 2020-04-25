import axios from 'axios';

export const SET_USER = 'SET_USER';
export const SET_RECENTLY_PLAYED = 'SET_RECENTLY_PLAYED';
export const SET_PLAY_NOW = 'SET_PLAY_NOW';
export const RESET_PLAY_NOW = 'RESET_PLAY_NOW';
export const SET_CURRENTLY_PLAYING = 'SET_CURRENTLY_PLAYING';
export const SET_IS_PLAYING = 'SET_IS_PLAYING';
export const SET_BACKGROUND_IMAGE = 'SET_BACKGROUND_IMAGE';
export const PLAY_SONG_START = 'PLAY_SONG_START';
export const PLAY_SONG_SUCCESS = 'PLAY_SONG_SUCCESS';
export const PLAY_SONG_FAIL = 'PLAY_SONG_FAIL';

export const playSong = (uris, deviceId) => {
  return (dispatch, getState) => {
    if (getState().current_user) {
      dispatch(playSongStart());
      axios({
        url: `https://api.spotify.com/v1/me/player/play`,
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${getState().current_user.access_token}`,
        },
        data: uris,
      })
        .then(() => {
          dispatch(playSongSuccess());
        })
        .catch(() => {
          dispatch(playSongFail());
        });
    }
  };
};

const playSongStart = () => {
  return {
    type: PLAY_SONG_START,
  };
};

const playSongSuccess = () => {
  return {
    type: PLAY_SONG_SUCCESS,
  };
};

const playSongFail = () => {
  return {
    type: PLAY_SONG_FAIL,
  };
};

export const pauseSong = () => {
  return (dispatch, getState) => {
    if (!getState().isPlaying) {
      axios({
        url: 'https://api.spotify.com/v1/me/player/pause',
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${getState().current_user.access_token}`,
        },
      })
        .then(res => {
          dispatch(setPauseSong());
        })
        .catch(err => {
          console.error(
            'Playback cannot be paused, Your playback is probably already paused'
          );
        });
    } else {
      console.error(
        'Playback cannot be paused, Your playback is probably already paused'
      );
    }
  };
};

const setPauseSong = () => {
  return {
    type: SET_IS_PLAYING,
  };
};

export const setRecentlyPlayed = data => {
  return {
    type: SET_RECENTLY_PLAYED,
    recently_played: data,
  };
};
