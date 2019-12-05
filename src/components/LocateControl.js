import { Component } from 'react';
import { withLeaflet } from 'react-leaflet';
import Locate from 'leaflet.locatecontrol';

class LocateControl extends Component {
  componentDidMount() {
    const { options, onLocationFound, startDirectly } = this.props;
    const { map } = this.props.leaflet;
    const locate = new Locate(options);

    map.on('locationfound', onLocationFound); 
    locate.addTo(map);

    if(startDirectly) {
      locate.start();
    }
  }

  render() {
    return null;
  }
}

export default withLeaflet(LocateControl);