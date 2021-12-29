import { useEffect, useRef, MutableRefObject } from "react";
import * as L from 'leaflet'; // must be imported first;
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet/dist/leaflet.css';
import styles from "./search.module.scss";

const MapSearch = () => {
    const mapRef = useRef<L.Map>(null) as MutableRefObject<L.Map>;

    useEffect(() => {
        mapRef.current = L.map('map', { zoomControl: true, center: [51.505, -0.09], zoom: 13 });
    }, [])

    return (
        <div className={styles.container}>
            <div id="map" className={styles.root}></div>
        </div>
    )
};

export default MapSearch