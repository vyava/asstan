import { useEffect, useRef, MutableRefObject } from "react";
import * as L from 'leaflet'; // must be imported first;
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet/dist/leaflet.css';
import styles from "./search.module.scss";

const MapSearch = () => {
    const mapRef = useRef<L.Map>(null) as MutableRefObject<L.Map>;

    useEffect(() => {
        if(!mapRef.current) {
            mapRef.current = L.map('map', { zoomControl: true, center: [51.505, -0.09], zoom: 13 });
        }

        var littleton = L.marker([39.61, -105.02]).bindPopup('This is Littleton, CO.'),
        denver    = L.marker([39.74, -104.99]).bindPopup('This is Denver, CO.'),
        aurora    = L.marker([39.73, -104.8]).bindPopup('This is Aurora, CO.'),
        golden    = L.marker([39.77, -105.23]).bindPopup('This is Golden, CO.');

        var cities = L.layerGroup([littleton, denver, aurora, golden]);

        mapRef.current.addLayer(cities);


    }, [])

    return (
        <div className={styles.container}>
            <div id="map" className={styles.root}></div>
        </div>
    )
};

export default MapSearch