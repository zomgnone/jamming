import secrets from './secrets.js';

const clientId = secrets.clientId;
const redirectURI = 'http://localhost:3000/';
let userAccessToken;

const Spotify = {
  getAccessToken() {
    if (userAccessToken) {
      return userAccessToken;
    }
    // Capture access_token and expires_in values from URL after redirect (Spotify's Implicit Grant)
    // Example URI: https://example.com/callback#access_token=NwAExz...BV3O2Tk&token_type=Bearer&expires_in=3600&state=123
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    if (accessTokenMatch && expiresInMatch) {
      userAccessToken = accessTokenMatch[1];
      let expiresIn = Number(expiresInMatch[1]);
      // wipe the access token (when it expires) and URL parameters
      window.setTimeout(() => userAccessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return userAccessToken;
    } else {
      window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
    }
  },

  // Search for tracks with Spotify API
  // https://developer.spotify.com/documentation/web-api/reference/#/operations/search
  search(term) {
    const accessToken = Spotify.getAccessToken();

    const fetchParams = {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }

    return fetch(`https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(term)}`, fetchParams
    ).then(response => {
      if (!response.ok) {
        throw new Error('Network response was not OK while fetching track');
      }
      return response.json();
    }).then(jsonResponse => {
      if (!jsonResponse.tracks) {
        return [];
      }
      return jsonResponse.tracks.items.map(track => ({
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        id: track.id,
        uri: track.uri
      }));
    }).catch(error => {
      console.error('There has been a problem with your fetch operation', error);
    });
  },

  // Get user ID, create new playlist and add tracks to it.
  savePlaylist(playlistName, trackURIs) {
    if (!playlistName || !trackURIs.length) {
      return;
    }

    const accessToken = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };
    let userId;
    let playlistId;

    // Get user ID
    // https://developer.spotify.com/documentation/web-api/reference/#/operations/get-current-users-profile
    return fetch('https://api.spotify.com/v1/me', { headers: headers }
    ).then(response => {
      if (!response.ok) {
        throw new Error('Network response was not OK while fetching user data');
      }
      return response.json();
    }).then(jsonResponse => {
      userId = jsonResponse.id;

      // Create new playlist
      // https://developer.spotify.com/documentation/web-api/reference/#/operations/create-playlist
      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({
          name: playlistName,
          description: 'jammmer playlist'
        })
      }).then(response => {
        if (!response.ok) {
          throw new Error('Network response was not OK while POSTing new playlist');
        }
        return response.json()
      }).then(jsonResponse => {
          playlistId = jsonResponse.id;

          // Add tracks to created playlist
          // https://developer.spotify.com/documentation/web-api/reference/#/operations/add-tracks-to-playlist
          return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            headers: headers,
            method: 'POST',
            body: JSON.stringify({
              uris: trackURIs
            })
          }).then(response => {
            if (!response.ok) {
              throw new Error('Network response was not OK while POSTing tracks to playlist');
            }
            return response.json();
          }).then(jsonResponse => {
            playlistId = jsonResponse.snapshot_id;
            return playlistId;
          }).catch(error => {
            console.error('There has been a problem with your fetch operation', error);
          });
       })
    })
    }
};


export default Spotify;