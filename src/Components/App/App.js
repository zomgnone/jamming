import './App.css';
import React from 'react';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [
        {name: 'name1', artist: 'artist1', album: 'album1', id: 1, uri: 'spotify:track:6rqhFgbbKwnb9MLmUQDhG6'},
        {name: 'name2', artist: 'artist2', album: 'album2', id: 2, uri: 'spotify:track:7ghjFgbbKwnb2MLmUQDhG7'},
        {name: 'name3', artist: 'artist3', album: 'album3', id: 3, uri: 'spotify:track:8uytFgbbKwnb9NBmUQDhG8'}
      ],
      playlistName: 'My new playlist',
      playlistTracks: [
        {name: 'name2', artist: 'artist2', album: 'album2', id: 2, uri: 'spotify:track:7ghjFgbbKwnb2MLmUQDhG7'},
        {name: 'name1', artist: 'artist1', album: 'album1', id: 1, uri: 'spotify:track:6rqhFgbbKwnb9MLmUQDhG6'}
      ]
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
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
  }

  search(term) {
    Spotify.search(term).then(searchResults => {
      this.setState({
        searchResults: searchResults
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
          </div>
        </div>
      </div>
    );
  }
}

export default App;