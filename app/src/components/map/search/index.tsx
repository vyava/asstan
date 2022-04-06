import { useState, useEffect, useRef, MutableRefObject, useContext } from "react";
import * as L from 'leaflet'; // must be imported first;
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import styles from "./search.module.scss";
import { initMap } from "src/components/map/map_init";
import { IBayiPoint, MapRange, OnlySelectedCritters, OnPanelRowSelect } from "src/types/map";
import { ITown } from "@shared/interfaces";
import { IDistrictUser } from "@shared/interfaces";
import { highlightLatestPings, setupSelectedPings } from "../point_setup";
import { mapContext } from "src/contexts/map.context";
import { prepareFeatureCollection } from "../map_helpers";

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

const MapSearch = (): JSX.Element => {
    const { usePings } = useContext(mapContext);

    const { isFetched: isFetchedPings, isError: isErrorPings, data: fetchedPings, dataUpdatedAt } = usePings();

    const mapRef = useRef<L.Map>(null) as MutableRefObject<L.Map>;

    // store the selection shapes
    const drawnItems = new L.FeatureGroup();

    // const selectedPingsLayer = new L.GeoJSON();

    const [selectedPingsLayer] = useState<L.GeoJSON<IBayiPoint[]>>(new L.GeoJSON());

    useEffect(() => {
        if (isFetchedPings && !!fetchedPings) {
            
            // let features = prepareFeatureCollection(fetchedPings);
            // @ts-ignore
            let featureCollection: GeoJSON.GeoJsonObject = { type: "FeatureCollection", features : fetchedPings }
            console.log(featureCollection)
            selectedPingsLayer.addData(featureCollection);
        }

    }, [dataUpdatedAt]);

    useEffect(() => {
        const ref = mapRef.current;
        if (!ref) {
            return;
        };
        if (selectedPingsLayer) {
            redrawLayers(prepareFeatureCollection(fetchedPings));
        }
    }, [dataUpdatedAt]);

    const handleDrawShape = (): void => {
        highlightLatestPings(selectedPingsLayer);
    };

    // clears existing pings/tracks layers
    const clearLayers = (): void => {
        const layerPicker = L.control.layers();
        const allLayers = [selectedPingsLayer];
        allLayers.forEach((l) => {
            layerPicker.removeLayer(l);
            if (typeof (l as L.GeoJSON).clearLayers === 'function') {
                (l as L.GeoJSON).clearLayers();
            }
        });
    };

    const redrawLayers = (newPings): void => {
        clearLayers();
        // selectedPingsLayer?.addData(newPings as any);
        if (isFetchedPings) {
            console.log("yeniden çiz")
            selectedPingsLayer?.addData(newPings as any);
        }
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