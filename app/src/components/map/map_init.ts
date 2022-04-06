import * as L from 'leaflet';
import { MutableRefObject } from "react";
import { MapStrings, MapTileLayers } from 'src/utils/constants';
import { IBayiPoint } from 'src/types/map';

// URL for BC Geographic Warehouse
const bcgw_url = 'http://openmaps.gov.bc.ca/geo/pub/ows';

export const initMap = (
    mapRef: MutableRefObject<L.Map>,
    drawnItems: L.FeatureGroup,
    selectedPings: L.GeoJSON<IBayiPoint[]>,
    drawSelectedLayer: () => void,
    // handleDrawLine: (l: any) => void,
    // handleDeleteLine: () => void,
): void => {
    mapRef.current = L.map('map', { zoomControl: false }).setView([41.015137, 28.979530], 5);
    // mapRef = useRef<L.Map>(null) as MutableRefObject<L.Map>;


    // @ts-ignore
    const layerPicker = L.control.layers(null, null, { position: 'topleft' });
    mapRef.current.addLayer(drawnItems);
    mapRef.current.addLayer(selectedPings);

    addTileLayers(mapRef, layerPicker);
    drawSelectedLayer();

    mapRef.current.on("click", (e) => {
        console.log(e)
    })

    selectedPings.on("baselayerchange", (e) => {
        console.log("layer tıklandı")
    })
};

// setup for normal pings for assigned devices
// when a ping is clicked/unselected, only the point style is changed
const setupPingOptions = (pings: L.GeoJSON, clickHandler: L.LeafletEventHandlerFn): void => {
    pings.options = {
        pointToLayer: (feature: any, latlng: L.LatLngExpression): L.Layer => {
            const marker = L.circleMarker(latlng);

            marker.on('click', (e) => {
                //   e.target.setStyle(selectedPointStyle());
                clickHandler(e);
            });
            marker.on('click', clickHandler);
            return marker;
        }
    };
};

const addTileLayers = (mapRef: React.MutableRefObject<L.Map>, layerPicker: L.Control.Layers): void => {

    const openTile = L.tileLayer(MapTileLayers.open, {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapRef.current)

    // layerPicker.addBaseLayer(bingOrtho, 'Bing Satellite');
    // layerPicker.addBaseLayer(bcGovBaseLayer, 'BC Government');
    // layerPicker.addBaseLayer(esriWorldTopo, 'ESRI World Topo');
    layerPicker.addBaseLayer(openTile, 'Openstreet');
};