import { useState, useEffect, useRef, MutableRefObject } from "react";
import * as L from 'leaflet'; // must be imported first;
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import styles from "./search.module.scss";
import { initMap } from "src/components/map/map_init";
import { IBayiPoint, MapRange, OnlySelectedCritters, OnPanelRowSelect } from "src/types/map";
import { ITown } from "src/interfaces/town.interface";
import { IDistrictUser } from "src/interfaces/district.interface";
import { highlightLatestPings, setupSelectedPings } from "../point_setup";

export type MapSearchBaseProps = {
    // handleRowSelected: OnPanelRowSelect;
    // handleShowOverview: OnMapRowCellClick;
};

export type MapSearchProps = MapSearchBaseProps & {
    _pings: IBayiPoint[];
    towns?: IDistrictUser[]// ITown;
    unassignedPings?: IBayiPoint[];
    // Bayi IDs of points that have a device/animal attached
    // selectedAssignedIDs?: number[];
    // setShowExportModal?: (b: boolean) => void;
    // handler for when 'show only checked' is clicked.
    // handleShowOnlySelected?: (o: OnlySelectedCritters) => void;
    range?: MapRange;
};

const MapSearch = ({
    _pings,
    // unassignedPings,
    // selectedAssignedIDs,
    // handleShowOverview,
    // handleShowOnlySelected,
    // handleRowSelected,
    // setShowExportModal,
    // range
}: MapSearchProps): JSX.Element => {
    const mapRef = useRef<L.Map>(null) as MutableRefObject<L.Map>;

    // store the selection shapes
    const drawnItems = new L.FeatureGroup();

    const selectedPingsLayer = new L.GeoJSON();
    // selectedPingsLayer.options = setupSelectedPings();

    useEffect(() => {
        let features = _pings.reduce((total, ping) => {
            if (!!ping.coords) {
                total.push({
                    "type": "Feature",
                    "properties": ping.properties,
                    "geometry": {
                        "type": "Point",
                        // @ts-ignore
                        "coordinates": [parseFloat(ping.coords.lng), parseFloat(ping.coords.lat)]
                    }
                });
            };
            return total;
        }, [])

        // let features = _pings.map(ping => {
        //     if(ping.coords !== undefined) {
        //         return {
        //             "type" : "Feature",
        //             "properties" : ping.properties,
        //             "geometry" : {
        //                 "type" : "Point",
        //                 // @ts-ignore
        //                 "coordinates" : [parseFloat(ping.coords.lat), parseFloat(ping.coords.lng)]
        //             }
        //         }
        //     }
        // });

        let featureCollection: any = { type: "FeatureCollection", features }
        // console.log(featureCollection);

        selectedPingsLayer.addData(featureCollection);
    }, []);

    useEffect(() => {
        const ref = mapRef.current;
        if (!ref) {
            return;
        };

        if (selectedPingsLayer) {
            ref.addLayer(selectedPingsLayer);
        }
    }, []);

    const handleDrawShape = (): void => {
        highlightLatestPings(selectedPingsLayer);
    };

    // initialize the map
    useEffect(() => {
        const updateComponent = (): void => {
            if (!mapRef.current) {
                initMap(mapRef, drawnItems, selectedPingsLayer, handleDrawShape/* handleDrawLine, handleDeleteLine */);
            }
            // tracksLayer.bringToBack();
        };
        updateComponent();
    });
    return (
        <div className={styles.container}>
            <div id="map" className={styles.root}></div>
        </div>
    )
};

export default MapSearch