import { useState, useEffect, useRef, MutableRefObject, useContext } from "react";
import * as L from 'leaflet'; // must be imported first;
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'; // Re-uses images from ~leaflet package
import 'leaflet-defaulticon-compatibility';
import styles from "./search.module.scss";
import { initMap } from "src/components/map/map_init";
import { IBayiPoint, MapRange, OnlySelectedCritters, OnPanelRowSelect } from "src/types/map";
import { ITown } from "@shared/interfaces";
import { IDistrictUser } from "@shared/interfaces";
import { highlightLatestPings, setupLatestPingOptions, setupPingOptions, setupSelectedPings } from "../point_setup";
import { mapContext } from "src/contexts/map.context";
import { layoutContext } from "src/contexts/layout.context";
import { prepareFeatureCollection } from "../map_helpers";
import { FeatureCollection } from "@turf/turf";
import Icon from "src/utils/icon";
import cls from "classnames";

export type MapSearchBaseProps = {
    // handleRowSelected: OnPanelRowSelect;
    // handleShowOverview: OnMapRowCellClick;
};

export type MapSearchProps = MapSearchBaseProps & {
    _pings: IBayiPoint[];
    towns?: IDistrictUser[]// ITown;
    unassignedPings?: IBayiPoint[];
};

const MapSearch = (): JSX.Element => {
    const { usePings } = useContext(mapContext);
    const { isMapLarge, toggleIsMapLarge } = useContext(layoutContext);

    const { isFetched: isFetchedPings, isError: isErrorPings, data: fetchedPings, dataUpdatedAt } = usePings();

    const mapRef = useRef<L.Map>(null) as MutableRefObject<L.Map>;

    const [pingsLayer] = useState<L.GeoJSON<IBayiPoint>>(new L.GeoJSON());

    const selectedPingsLayer = new L.GeoJSON();

    selectedPingsLayer.options = setupSelectedPings();

    const [pings, setPings] = useState<IBayiPoint[]>([]);

    // store the selection shapes
    const drawnItems = new L.FeatureGroup();

    useEffect(() => {
        setTimeout(() => {
            mapRef.current.invalidateSize();
        }, 100);
    }, [isMapLarge])

    
    useEffect(() => {
        const update = (): void => {
            if (isFetchedPings && !isErrorPings) {


                setupPingOptions(pingsLayer);
                setupLatestPingOptions(selectedPingsLayer);

                setPings(fetchedPings);

                let featureCollection: GeoJSON.GeoJsonObject = prepareFeatureCollection(fetchedPings)

                redrawLayers(featureCollection as any);

                redrawPings(fetchedPings);

            }
        }
        update();
    }, [dataUpdatedAt]);

    const redrawPings = (pings: IBayiPoint[]): void => {
        const layerPicker = L.control.layers();
        layerPicker.removeLayer(pingsLayer);
        pingsLayer.clearLayers();
        pingsLayer.addData(pings as any);
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

    const redrawLayers = (newPings = fetchedPings): void => {
        clearLayers();
        selectedPingsLayer?.addData(newPings as any);
        // console.log("yeniden çiz")
        // console.log(newPings)
        pingsLayer.addData(newPings as any)
        // selectedPingsLayer.addData(newPings as any);
    };

    // initialize the map
    useEffect(() => {
        const updateComponent = (): void => {
            if (!mapRef.current) {
                initMap(mapRef, selectedPingsLayer, /* handleDrawShape *//* handleDrawLine, handleDeleteLine */);
            }
            // tracksLayer.bringToBack();
        };
        updateComponent();
    });
    return (
        <div className={cls({[styles.container] : true, [styles.large] : isMapLarge})}>
            <div id="map" className={styles.root}></div>
            <button className={styles.map_resizer} onClick={() => toggleIsMapLarge()}>
                <span>{isMapLarge ? 'Daralt' : 'Genişlet'}</span>
                <Icon theme="light" name="arrow-right-arrow-left" width="10" className={styles.map_resizer_icon}/>
            </button>
        </div>
    )
};

export default MapSearch