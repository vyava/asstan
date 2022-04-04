import * as L from 'leaflet';
import { getFillColorByStatus, getOutlineColor, MAP_COLOURS, MAP_COLOURS_OUTLINE } from 'src/components/map/map_helpers';
import { IBayiPoint } from 'src/types/map';

const defaultPointStyle: L.CircleMarkerOptions = {
  radius: 8,
  weight: 1,
  opacity: 0.8,
  fillOpacity: 0.9
};

const selectedPointStyle = (): L.CircleMarkerOptions => {
  return { 
    fillColor: MAP_COLOURS.selected,
    color: MAP_COLOURS_OUTLINE.selected,
    ...defaultPointStyle 
  }
}

const animalColoredPointStyle = (ping: IBayiPoint, isUnassigned: boolean): L.CircleMarkerOptions => {
  const fillColor = isUnassigned ? MAP_COLOURS['unassigned point'] : getFillColorByStatus(ping);
  const color = isUnassigned ?  MAP_COLOURS_OUTLINE['unassigned point'] : getOutlineColor(ping);
  return {
    ...defaultPointStyle,
    fillColor,
    color
  }
}

const createLatestPingIcon = (fillColour: string, color = '#000'): L.DivIcon => {
  return L.divIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" aria-labelledby="title"
    aria-describedby="desc" role="img" xmlns:xlink="http://www.w3.org/1999/xlink">
      <path data-name="layer1"
      d="M32 2A24 24 0 0 0 8 26c0 .8 0 1.6.1 2.3v.3C10.1 47.6 32 62 32 62s21.9-14.6 23.8-33.3v-.4c.1-.8.1-1.5.1-2.3A24 24 0 0 0 32 2zm0 36a12 12 0 1 1 12-12 12 12 0 0 1-12 12z"
      fill="#202020"></path>
    </svg>`,
    className: 'latest-ping'
  });
};

const latestSelectedPingIcon = createLatestPingIcon(MAP_COLOURS.selected);
// setup for the latest pings for assigned devices
// the icon is replaced when the marker is clicked
const setupLatestPingOptions = (pings: L.GeoJSON, clickHandler: L.LeafletEventHandlerFn, closeHandler: L.LeafletEventHandlerFn, isUnassigned: boolean): void => {
  pings.options = {
    pointToLayer: (feature: IBayiPoint, latlng: L.LatLngExpression): L.Layer => {
      const unselectedIcon = createLatestPingIcon(isUnassigned ?  MAP_COLOURS['unassigned point'] : getFillColorByStatus(feature), isUnassigned ? MAP_COLOURS_OUTLINE['unassigned point'] : getOutlineColor(feature));
      const marker = new L.Marker(latlng, {icon: unselectedIcon});
      // make a hidden popup that will help deal with click events
      marker.bindPopup('', {className:'marker-popup' }).openPopup();
      marker.on('popupclose', (e) => {
        e.target.setIcon(unselectedIcon)
        closeHandler(e);
      });
      marker.on('click', (e) => {
        e.target.setIcon(latestSelectedPingIcon);
        clickHandler(e);
      });
      return marker;
    }
  };
};


const highlightLatestPings = (layer: L.GeoJSON, selectedIDs?: number[]): void => {

  layer.eachLayer((p: any) => {
    const feature = p.feature;
    if (typeof p.setIcon === 'function') {
      // if (selectedIDs.includes(feature.id)) {
        p.setIcon(latestSelectedPingIcon);
      // } else {
      //   p.setIcon(createLatestPingIcon(getFillColorByStatus(feature), getOutlineColor(feature)));
      // }
    }
  });
};

const highlightPings = (layer: L.GeoJSON, selectedIDs: number[]): void => {
  layer.eachLayer((p: any) => {
    const feature = p.feature;
    if (typeof p.setStyle === 'function') {
      p.setStyle({
        weight: 1.0,
        color: getOutlineColor(feature),
        fillColor: getFillColorByStatus(feature, selectedIDs.includes(feature.id))
      });
    }
  });
}


// setup for normal pings for assigned devices
// when a ping is clicked/unselected, only the point style is changed
const setupPingOptions = (pings: L.GeoJSON, clickHandler: L.LeafletEventHandlerFn, closeHandler: L.LeafletEventHandlerFn , isUnassigned: boolean): void => {
  pings.options = {
    pointToLayer: (feature: IBayiPoint, latlng: L.LatLngExpression): L.Layer => {
      const critterStyle = animalColoredPointStyle(feature, isUnassigned);
      const marker = L.circleMarker(latlng, critterStyle);
      marker.bindPopup('', {className:'marker-popup' }).openPopup();
      marker.on('popupclose', (e) => {
        e.target.setStyle(critterStyle);
        closeHandler(e);
      }) 
      marker.on('click', (e) => {
        e.target.setStyle(selectedPointStyle());
        clickHandler(e);
      });
      marker.on('click', clickHandler);
      return marker;
    }
  };
};

// tracks setup
const setupTracksOptions = (tracks: L.GeoJSON, isUnassigned: boolean): void => {
  const color = isUnassigned ? MAP_COLOURS['unassigned line segment'] : MAP_COLOURS.track;
  tracks.options = {
    style: (): Record<string, string> => {
      return {
        weight: '2.0',
        color
      };
    }
  };
  tracks.setZIndex(0);
};

// setup for pings within a drawn shape (ex. polygon)
const setupSelectedPings = (): L.GeoJSONOptions => {
  return {
    pointToLayer: (feature, latlng) => {
      const pointStyle = {
        class: 'selected-ping',
        fillColor: MAP_COLOURS.selected,
        ...defaultPointStyle
      };
      return L.circleMarker(latlng, pointStyle);
    }
  };
};

export { highlightPings, highlightLatestPings, createLatestPingIcon, defaultPointStyle, setupSelectedPings, setupLatestPingOptions, setupTracksOptions, setupPingOptions };