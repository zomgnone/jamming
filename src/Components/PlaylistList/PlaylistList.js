import './PlaylistList.css';
import React from 'react';
import PlaylistListItem from '../PlaylistListItem/PlaylistListItem';

class PlaylistList extends React.Component {
  render() {
    return (
      <div className="PlaylistList">
        <h2>Local Playlists</h2>
        {
          this.props.playlistListItems.map(item => {
            return <PlaylistListItem name={item.name} key={item.playlistid} />;
          })
        }
      </div>
    );
  }
}

export default PlaylistList;