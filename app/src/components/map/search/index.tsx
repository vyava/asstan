import { useState, useEffect, useRef, MutableRefObject } from "react";
import * as L from 'leaflet'; // must be imported first;
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet/dist/leaflet.css';
import styles from "./search.module.scss";
import { initMap } from "../map_init";
import { highlightLatestPings, setupPingOptions, setupSelectedPings } from "../point_setup";
import { ITelemetryPoint } from "src/types/map";
import { usePings } from "src/fetchers/pings";
import { getUniqueCritterIDsFromSelectedPings } from "../map_helpers";
import { IBayi } from "src/interfaces/bayi.interface";

const MapSearch = () => {
    const mapRef = useRef<L.Map>(null) as MutableRefObject<L.Map>;

    // store the selection shapes
    const drawnItems = new L.FeatureGroup();
    const drawnLines: Array<any> = [];

    const { isFetching: fetchingPings, isError: isErrorPings, data: fetchedPings } = usePings();

    const [pingsLayer] = useState<L.GeoJSON<L.Point>>(new L.GeoJSON()); // Store Pings

    const selectedPingsLayer = new L.GeoJSON();
    selectedPingsLayer.options = setupSelectedPings();

    // pings/tracks state is changed when filters are applied, so use these variables for the 'global' state - used in bottom panel
    const [pings, setPings] = useState<ITelemetryPoint[] | any>([]);
    const [unassignedPings, setUnassignedPings] = useState<ITelemetryPoint[]>([]);
    const [selectedPingIDs, setSelectedPingIDs] = useState<number[]>([]);


    // pings layer state
    const [tracksLayer] = useState<L.GeoJSON<L.Polyline>>(new L.GeoJSON()); // Store Tracks


    // initialize the map
    useEffect(() => {
        const updateComponent = (): void => {
            if (!mapRef.current) {
                initMap(mapRef, drawnItems, selectedPingsLayer, handleDrawShape, handleDrawLine, handleDeleteLine);
            }
            tracksLayer.bringToBack();
        };
        updateComponent();
    });

    // Assing pings
    useEffect(() => {
        const update = (): void => {
            setupPingOptions(pingsLayer, handlePointClick, handlePointClose, false);

            setPings(fetchedPings);
            // @ts-ignore
            applyPingsToMap(fetchedPings);
        };

        update();
    });

    /**
   * when a map point is clicked,
   * populate the popup with metadata and show it
   */
    const handlePointClick = (event: L.LeafletEvent): void => {
        const layer = event.target;
        const feature: ITelemetryPoint = layer?.feature;
        console.log("handlePointClick")

        // setPopupInnerHTML(feature);
        // set the feature id state so bottom panel will highlight the row
        // setSelectedPingIDs([feature.id]);
    };

    /**
   * when the native leaflet popup (always hidden) is 'closed'
   */
    // todo: handle unselected pings
    const handlePointClose = (event: L.LeafletEvent): void => {

        console.log("handlePointClose")
        // hidePopup();
        // unhighlight them in bottom table
        // setSelectedPingIDs([]);
    };

    // handles the drawing and deletion of shapes, setup in map_init
    // todo: does not handle unassigned layers yet
    const handleDrawShape = (): void => {
        // hidePopup();
        const clipper = drawnItems.toGeoJSON();

        // const pings = pingsLayer.toGeoJSON();
        // const overlay = pointsWithinPolygon(pings as any, clipper as any);
        // const ids = [...(overlay.features.map((f) => f.id) as number[])];
        // highlightPings(pingsLayer, ids);

        // const latestPings = latestPingsLayer.toGeoJSON();
        // const overlayLatest = pointsWithinPolygon(latestPings as any, clipper as any);
        // const latestIds = [...(overlayLatest.features.map((f) => f.id) as number[])];
        // highlightLatestPings(latestPingsLayer, latestIds);

        // highlight these rows in bottom panel
        // setSelectedPingIDs([...ids, ...latestIds]);
    };

    // note: using L.Layergroup isn't removing marker
    const handleDrawLine = (l: L.Layer): void => {
        drawnLines.push(l);
    };

    // triggered when 'Delete' is clicked in the draw control
    const handleDeleteLine = (): void => {
        if (drawnLines.length) {
            drawnLines.forEach((l) => {
                mapRef.current.removeLayer(l);
            });
        }
    };

    const applyPingsToMap = (pings: IBayi[]): void => {



        if (!fetchedPings) {
            return;
        };

        var century21icon = L.icon({
            iconUrl: 'https://amberbrantjes.nl/wp-content/uploads/2015/10/map-marker-icon.png',
            iconSize: [20, 20]
        });

        let _pings = pings.map((p: IBayi) => {
            L.marker([parseFloat(p.coords?.lat as any), parseFloat(p.coords?.lng as any)], {
                icon : century21icon,
                title : p.unvan,
                alt : p.unvan
            }).addTo(mapRef.current)
        });
        // selectedPingsLayer.addData(_pings);

        // const uniqueCritterIDs = getUniqueCritterIDsFromSelectedPings(
        //   p,
        //   pings.map((p : any) => p.id)
        // );

    };


    return (
        <div className={styles.container}>
            <div id="map" className={styles.root}></div>
        </div>
    )
};

export default MapSearch