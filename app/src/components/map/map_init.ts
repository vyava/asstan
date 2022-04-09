import * as L from 'leaflet';
import { MutableRefObject } from "react";
import { MapStrings, MapTileLayers } from 'src/utils/constants';
import { IBayiPoint } from 'src/types/map';

export const initMap = (
    mapRef: MutableRefObject<L.Map>,
    pingsLayer: L.GeoJSON<IBayiPoint[]>,
    // drawSelectedLayer: () => void,
    // handleDrawLine: (l: any) => void,
    // handleDeleteLine: () => void,
): void => {
    // mapRef = useRef<L.Map>(null) as MutableRefObject<L.Map>;

    // @ts-ignore
    const layerPicker = L.control.layers(null, null, { position: 'topleft' });
    
    mapRef.current = L.map('map', { zoomControl: false }).on('loading load', handleMapLoad).setView([41.015137, 28.979530], 5);

    mapRef.current.addLayer(pingsLayer);

    addTileLayers(mapRef, layerPicker);
    // drawSelectedLayer();
    // console.log(drawnItems.toGeoJSON())
};

const handleMapLoad = (e) => {
    console.log("EVENT : MAP LOADED")
    // console.log(e)
}

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