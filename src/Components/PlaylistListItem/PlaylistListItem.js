import './PlaylistListItem.css';
import React from 'react';

class PlaylistListItem extends React.Component {
  render() {
    return(
      <div className="PlaylistListItem">
        <h3>{this.props.name}</h3>
      </div>
    )
  }
};

export default PlaylistListItem;