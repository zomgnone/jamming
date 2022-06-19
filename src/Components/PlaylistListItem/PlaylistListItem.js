import './PlaylistListItem.css';
import React from 'react';

class PlaylistListItem extends React.Component {
  constructor(props) {
    super(props);
    this.selectPlaylist = this.selectPlaylist.bind(this);
  }

  selectPlaylist() {
    this.props.onSelect(this.props.playlistId);
  }

  render() {
    return(
      <div className="PlaylistListItem" onClick={this.selectPlaylist}>
        <h3>{this.props.name}</h3>
      </div>
    )
  }
};

export default PlaylistListItem;