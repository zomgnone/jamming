import './App.css';
import React from 'react';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import PlaylistList from '../PlaylistList/PlaylistList';
import Spotify from '../../util/Spotify';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: [],
      playlistListItems: []
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.getPlaylists = this.getPlaylists.bind(this);
  }

  addTrack(track) {
    const tracks = this.state.playlistTracks;
    if (tracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }

    tracks.push(track);
    this.setState({
      playlistTracks: tracks
    });
  }

  removeTrack(track) {
    const tracks = this.state.playlistTracks;
    const newTracks = tracks.filter(savedTrack => savedTrack.id !== track.id);
    this.setState({
      playlistTracks: newTracks
    });
  }

  updatePlaylistName(name) {
    this.setState({
      playlistName: name  
    });
  }

  savePlaylist() {
    const trackURIs = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
      this.setState({
        playlistName: 'New Playlist',
        playlistTracks: []
      })
    })
  }

  search(term) {
    Spotify.search(term).then(searchResults => {
      this.setState({
        searchResults: searchResults
      });
    });
  }

  // Get Spotify access token first time app loads
  componentDidMount() {
    window.addEventListener('load', () => Spotify.getAccessToken());
  }
  
  getPlaylists() {
    Spotify.getUserPlaylists().then(playlistList => {
      this.setState({
        playlistListItems: playlistList
      });
    });
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults  searchResults={this.state.searchResults}
                            onAdd={this.addTrack} />
            <Playlist playlistName={this.state.playlistName}
                      playlistTracks={this.state.playlistTracks}
                      onRemove={this.removeTrack}
                      onNameChange={this.updatePlaylistName}
                      onSave={this.savePlaylist} />
            <PlaylistList playlistListItems={this.state.playlistListItems} 
                          onGet={this.getPlaylists} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;