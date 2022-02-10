import * as L from 'leaflet';
import { FeatureLayer } from 'esri-leaflet';
import { MutableRefObject, useRef } from "react";
import { MapStrings, MapTileLayers } from 'src/utils/constants';
import { plainToClass } from 'class-transformer';
import { IBayiPoint } from 'src/types/map';
import dayjs from 'dayjs';
import { formatLocal } from 'src/utils/time';

// URL for BC Geographic Warehouse
const bcgw_url = 'http://openmaps.gov.bc.ca/geo/pub/ows';

export const initMap = (
    mapRef: MutableRefObject<L.Map>,
    // drawnItems: L.FeatureGroup,
    selectedPings: L.GeoJSON<IBayiPoint[]>,
    // drawSelectedLayer: () => void,
    // handleDrawLine: (l: any) => void,
    // handleDeleteLine: () => void,
): void => {
    // mapRef.current = L.map('map', { zoomControl: true }).setView([41.015137, 28.979530], 4);
    mapRef = useRef<L.Map>(null) as MutableRefObject<L.Map>;


    // @ts-ignore
    const layerPicker = L.control.layers(null, null, { position: 'topleft' });
    L.drawLocal.draw.toolbar.buttons.polyline = MapStrings.drawLineLabel;
    L.drawLocal.draw.toolbar.buttons.polygon = MapStrings.drawPolygonLabel;
    L.drawLocal.draw.toolbar.buttons.rectangle = MapStrings.drawRectangleLabel;

    // const drawControl = new L.Control.Draw({
    //     position: 'topright',
    //     draw: {
    //         marker: false,
    //         circle: false,
    //         circlemarker: false
    //     },
    //     edit: {
    //         featureGroup: drawnItems
    //     },
    // });


    // mapRef.current.addControl(drawControl);
    // mapRef.current.addLayer(drawnItems);
    mapRef.current.addLayer(selectedPings);

    addTileLayers(mapRef, layerPicker);
};

const addTileLayers = (mapRef: React.MutableRefObject<L.Map>, layerPicker: L.Control.Layers): void => {

    // const bingOrtho = L.tileLayer(MapTileLayers.bing, {
    //     attribution: '&copy; <a href="https://esri.com">ESRI Basemap</a> ',
    //     maxZoom: 24,
    //     maxNativeZoom: 17
    // }).addTo(mapRef.current);
    // const bcGovBaseLayer = L.tileLayer(MapTileLayers.govBase, {
    //     maxZoom: 24,
    //     attribution: '&copy; <a href="https://www2.gov.bc.ca/gov/content/home">BC Government</a> '
    // });
    // const esriWorldTopo = L.tileLayer(MapTileLayers.esriWorldTopo, {
    //     maxZoom: 24
    // });

    const openTile = L.tileLayer(MapTileLayers.open, {
        maxZoom : 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapRef.current)

    // layerPicker.addBaseLayer(bingOrtho, 'Bing Satellite');
    // layerPicker.addBaseLayer(bcGovBaseLayer, 'BC Government');
    // layerPicker.addBaseLayer(esriWorldTopo, 'ESRI World Topo');
    layerPicker.addBaseLayer(openTile, 'Openstreet');
    

    // overlays from BCGW
    layerPicker.addOverlay(getCHB(), 'Caribou Herd Boundaries');
    layerPicker.addOverlay(getPPA(), 'Parks & Protected Areas');
};

// caribou herd boundaries
const getCHB = () => {
    const fl = new FeatureLayer({
        url: 'https://services6.arcgis.com/ubm4tcTYICKBpist/arcgis/rest/services/Caribou_BC/FeatureServer/0'
    });
    return fl as unknown as L.TileLayer;
};

// parks and protected areas
const getPPA = () => {
    return L.tileLayer.wms(bcgw_url, {
        layers: 'WHSE_TANTALIS.TA_PARK_ECORES_PA_SVW',
        format: 'image/png',
        transparent: true,
        opacity: 0.6
    });
};

// ENV regional boundaries
const getERB = () => {
    return L.tileLayer.wms(bcgw_url, {
        layers: 'WHSE_ADMIN_BOUNDARIES.EADM_WLAP_REGION_BND_AREA_SVW',
        format: 'image/png',
        transparent: true,
        opacity: 0.6
    });
};

// wildlife habitat areas
const getWHA = () => {
    return L.tileLayer.wms(bcgw_url, {
        layers: 'WHSE_WILDLIFE_MANAGEMENT.WCP_WILDLIFE_HABITAT_AREA_POLY',
        format: 'image/png',
        transparent: true,
        opacity: 0.6
    });
};

// wildlife magement units
const getWMU = () => {
    return L.tileLayer.wms(bcgw_url, {
        layers: 'WHSE_WILDLIFE_MANAGEMENT.WAA_WILDLIFE_MGMT_UNITS_SVW',
        format: 'image/png',
        transparent: true,
        opacity: 0.6
    });
};

// ungulate winter ranges
const getUWR = () => {
    return L.tileLayer.wms(bcgw_url, {
        layers: 'WHSE_WILDLIFE_MANAGEMENT.WCP_UNGULATE_WINTER_RANGE_SP',
        format: 'image/png',
        transparent: true,
        opacity: 0.6
    });
};

// TRIM contour lines
const getTCL = () => {
    return L.tileLayer.wms(bcgw_url, {
        layers: 'WHSE_BASEMAPPING.TRIM_CONTOUR_LINES',
        format: 'image/png',
        transparent: true,
        opacity: 0.6
    });
};

const hidePopup = (): void => {
    const doc : any = document.getElementById('popup');
    doc.innerHTML = '';
    doc.classList.remove('appear-above-map');
};