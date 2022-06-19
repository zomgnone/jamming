import './PlaylistList.css';
import React from 'react';
import PlaylistListItem from '../PlaylistListItem/PlaylistListItem';

class PlaylistList extends React.Component {
  render() {
    return (
      <div className="PlaylistList">
        <h2>Local Playlists</h2>
        <button className="PlaylistList-get" onClick={this.props.onGet}>GET PLAYLISTS</button>
        {
          this.props.playlistListItems.map(item => {
            return <PlaylistListItem name={item.name} key={item.id} playlistId={item.playlistId} onSelect={this.props.onSelect}/>;
          })
        }
      </div>
    );
  }
}

export default PlaylistList;