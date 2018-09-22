import * as actionTypes from "../actions/actionTypes";

const initialState = {
    current_user: null,
    recently_played: null,
    play_now: {
        type: null,
        uri: null
    },
    currently_playing: null,
    isPlaying: false,
    backgroundImage: "linear-gradient(rgb(58, 91, 95), rgb(6, 9, 10) 85%)"
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_USER:
            return {
                ...state,
                isLoggedIn: true,
                current_user: action.user
            };
        case actionTypes.SET_RECENTLY_PLAYED:
            return {
                ...state,
                recently_played: action.recently_played
            };
        case actionTypes.SET_PLAY_NOW:
            return {
                ...state,
                play_now: {
                    type: action.uri_type,
                    uri: action.uri
                }
            };
        case actionTypes.RESET_PLAY_NOW:
            return {
                ...state,
                play_now: {
                    type: null,
                    uri: null
                }
            };
        case actionTypes.SET_CURRENTLY_PLAYING:
            return {
                ...state,
                currently_playing: action.song
            };
        case actionTypes.SET_IS_PLAYING:
            return {
                ...state,
                isPlaying: action.isPlaying
            };
        case actionTypes.SET_BACKGROUND_IMAGE:
            return {
                ...state,
                backgroundImage: action.backgroundImage
            };
        case actionTypes.PLAY_SONG_START:
            return {
                ...state,
                play_now: null
            };
        default:
            return state;
    }
};

export default reducer;
