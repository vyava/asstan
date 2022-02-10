import { useState, useEffect, useRef, MutableRefObject } from "react";
import * as L from 'leaflet'; // must be imported first;
import styles from "./search.module.scss";
import { initMap } from "src/components/map/map_init";
import { IBayiPoint, MapRange, OnlySelectedCritters, OnPanelRowSelect } from "src/types/map";

export type MapSearchBaseProps = {
    // handleRowSelected: OnPanelRowSelect;
    // handleShowOverview: OnMapRowCellClick;
};

export type MapSearchProps = MapSearchBaseProps & {
    pings: IBayiPoint[];
    towns? :  any// ITown;
    unassignedPings?: IBayiPoint[];
    // Bayi IDs of points that have a device/animal attached
    // selectedAssignedIDs?: number[];
    // setShowExportModal?: (b: boolean) => void;
    // handler for when 'show only checked' is clicked.
    // handleShowOnlySelected?: (o: OnlySelectedCritters) => void;
    range?: MapRange;
};

const MapSearch = ({
    pings,
    // unassignedPings,
    // selectedAssignedIDs,
    // handleShowOverview,
    // handleShowOnlySelected,
    // handleRowSelected,
    // setShowExportModal,
    // range
}: MapSearchProps) : JSX.Element => {
    const mapRef = useRef<L.Map>(null) as MutableRefObject<L.Map>;

    // initialize the map
    useEffect(() => {
        const updateComponent = (): void => {
            if (!mapRef.current) {
                // initMap(mapRef,  /* drawnItems ,*/ pings as any, /* handleDrawShape, handleDrawLine, handleDeleteLine */);
            }
            // tracksLayer.bringToBack();
        };
        updateComponent();
    });

    // // Assing pings
    // useEffect(() => {
    //     const update = (): void => {
    //         setupPingOptions(pingsLayer, handlePointClick, handlePointClose, false);

    //         setPings(fetchedPings);
    //         // @ts-ignore
    //         applyPingsToMap(fetchedPings);
    //     };

    //     update();
    // });

    // handles the drawing and deletion of shapes, setup in map_init
    // todo: does not handle unassigned layers yet
    const handleDrawShape = (): void => {
        // hidePopup();
        // const clipper = drawnItems.toGeoJSON();

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
    // const handleDrawLine = (l: L.Layer): void => {
    //     drawnLines.push(l);
    // };


    // const applyPingsToMap = (pings: IBayiPoint[]): void => {
    //     if (!fetchedPings) {
    //         return;
    //     };

    //     var century21icon = L.icon({
    //         iconUrl: 'https://amberbrantjes.nl/wp-content/uploads/2015/10/map-marker-icon.png',
    //         iconSize: [20, 20]
    //     });

    //     let _pings = pings.map((p: IBayiPoint) => {
    //         L.marker([parseFloat(p.coords?.lat as any), parseFloat(p.coords?.lng as any)], {
    //             icon: century21icon,
    //             title: p.properties.unvan,
    //             alt: p.properties.unvan
    //         }).addTo(mapRef.current)
    //     });
    //     // selectedPingsLayer.addData(_pings);

    //     // const uniqueCritterIDs = getUniqueCritterIDsFromSelectedPings(
    //     //   p,
    //     //   pings.map((p : any) => p.id)
    //     // );

    // };


    return (
        <div className={styles.container}>
            <div id="map" className={styles.root}></div>
        </div>
    )
};

export default MapSearch