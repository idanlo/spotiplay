import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { GenreView } from './GenreView';

configure({ adapter: new Adapter() });

describe('GenreView', () => {
    it('should render 2 MediaCards', async () => {
        const flushAllPromises = () =>
            new Promise(resolve => setImmediate(resolve()));
        const api = {
            getCategoryPlaylists: jest.fn(() =>
                Promise.resolve({
                    playlists: {
                        href:
                            'https://api.spotify.com/v1/browse/categories/dinner/playlists?country=SE&offset=5&limit=10',
                        items: [
                            {
                                collaborative: false,
                                external_urls: {
                                    spotify:
                                        'https://open.spotify.com/playlist/37i9dQZF1DX2FsCLsHeMrM'
                                },
                                href:
                                    'https://api.spotify.com/v1/playlists/37i9dQZF1DX2FsCLsHeMrM',
                                id: '37i9dQZF1DX2FsCLsHeMrM',
                                images: [
                                    {
                                        height: 300,
                                        url:
                                            'https://i.scdn.co/image/1b3c1080669581993ccd644addb1d6b7b269691f',
                                        width: 300
                                    }
                                ],
                                name: 'Kitchen Swagger',
                                owner: {
                                    display_name: 'Spotify',
                                    external_urls: {
                                        spotify:
                                            'https://open.spotify.com/user/spotify'
                                    },
                                    href:
                                        'https://api.spotify.com/v1/users/spotify',
                                    id: 'spotify',
                                    type: 'user',
                                    uri: 'spotify:user:spotify'
                                },
                                primary_color: null,
                                public: null,
                                snapshot_id:
                                    'MTUzNzU2NjgxMiwwMDAwMDA2MjAwMDAwMTY1YjNiYTAxMTcwMDAwMDE2MmYyYjBlOGQ4',
                                tracks: {
                                    href:
                                        'https://api.spotify.com/v1/playlists/37i9dQZF1DX2FsCLsHeMrM/tracks',
                                    total: 78
                                },
                                type: 'playlist',
                                uri:
                                    'spotify:user:spotify:playlist:37i9dQZF1DX2FsCLsHeMrM'
                            },
                            {
                                collaborative: false,
                                external_urls: {
                                    spotify:
                                        'https://open.spotify.com/playlist/37i9dQZF1DXatMjChPKgBk'
                                },
                                href:
                                    'https://api.spotify.com/v1/playlists/37i9dQZF1DXatMjChPKgBk',
                                id: '37i9dQZF1DXatMjChPKgBk',
                                images: [
                                    {
                                        height: 300,
                                        url:
                                            'https://i.scdn.co/image/7417d9e5610366317c0b61584fcae687dac23c16',
                                        width: 300
                                    }
                                ],
                                name: 'Dinner Music',
                                owner: {
                                    display_name: 'Spotify',
                                    external_urls: {
                                        spotify:
                                            'https://open.spotify.com/user/spotify'
                                    },
                                    href:
                                        'https://api.spotify.com/v1/users/spotify',
                                    id: 'spotify',
                                    type: 'user',
                                    uri: 'spotify:user:spotify'
                                },
                                primary_color: null,
                                public: null,
                                snapshot_id:
                                    'MTUzNzU2NjgxOCwwMDAwMDA1NDAwMDAwMTY0YTdlMzQyZmEwMDAwMDE2MmYyYjBlOGQ4',
                                tracks: {
                                    href:
                                        'https://api.spotify.com/v1/playlists/37i9dQZF1DXatMjChPKgBk/tracks',
                                    total: 80
                                },
                                type: 'playlist',
                                uri:
                                    'spotify:user:spotify:playlist:37i9dQZF1DXatMjChPKgBk'
                            }
                        ],
                        limit: 10,
                        next:
                            'https://api.spotify.com/v1/browse/categories/dinner/playlists?country=SE&offset=15&limit=10',
                        offset: 5,
                        previous:
                            'https://api.spotify.com/v1/browse/categories/dinner/playlists?country=SE&offset=0&limit=10',
                        total: 26
                    }
                })
            )
        };
        const match = {
            params: {
                id: 'sports'
            }
        };
        const wrapper = shallow(<GenreView api={api} match={match} />);
        await flushAllPromises();
        wrapper.update();

        expect(wrapper.find('MediaCard')).toHaveLength(2);
    });
});
