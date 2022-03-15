import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import styles from "./map.module.scss";
import * as _ from "lodash";

import MapSidebar from "./sidebar";

// import { highlightLatestPings, setupLatestPingOptions, setupPingOptions, setupSelectedPings } from "src/components/map/point_setup";
import { IBayiPoint } from "src/types/map";
import { usePings } from "src/fetchers/pings";
import { useTowns } from "src/fetchers/towns";
// import { IBayi } from "src/interfaces/bayi.interface";
// import dayjs from "dayjs";
// import { formatDay, getToday } from "src/utils/time";
// import { ICodeFilter } from "src/types/code";
// import { applyFilter, fillPoint, groupFilters, splitPings } from "./map_helpers";
import { useDistricts } from "src/fetchers/districts";
import { useQuery, useQueryClient } from "react-query";
import { mapContext } from "src/contexts/map.context";
import { bayiToPing } from "./map_helpers";


const MapField = dynamic(() => import("src/components/map/search/index"), { ssr: false })

const Map = () => {
    // const fetchedPings = usePings(fetchedBayiler) || [];
    const { useBayiler } = useContext(mapContext);

    const { isFetching: fetchingBayiler, isFetched, isError: isErrorBayiler, data: fetchedBayiler } = useBayiler();
    let pings = [];
    if(isFetched){

    pings = bayiToPing(fetchedBayiler);
    }


    // let towns = !!fetchedPings ? fetchedPings.map(ping => ({ city: ping.properties.il, town: ping.properties.ilce })) : [];

    // let uniqueTowns = _.uniqBy(towns, v => [v.city, v.town].join());

    // const { isFetching: fetchingTowns, isError: isErrorTowns, data: fetchedTowns } = useTowns(uniqueTowns, {
    //     enabled: !!fetchedPings,
    //     select : res => res.map(r => r.properties)
    // });

    //     const [pingsLayer] = useState<L.GeoJSON<L.Point>>(new L.GeoJSON()); // Store Pings
    //     const [townsLayer] = useState<L.GeoJSON<L.Polyline>>(new L.GeoJSON()); // Store Towns

    //     const selectedPingsLayer = new L.GeoJSON();
    //     selectedPingsLayer.options = setupSelectedPings();

    //     // pings/tracks state is changed when filters are applied, so use these variables for the 'global' state - used in bottom panel
    // const [pings, setPings] = useState<IBayiPoint[] | any>([]);
    //     const [selectedPingIDs, setSelectedPingIDs] = useState<number[]>([]);
    //     // pings layer state

    //     useEffect(() => {
    //         const update = (): void => {
    //             if (fetchedPings) {
    //                 // must be called before adding data to pings layer
    //                 setupPingOptions(pingsLayer, handlePointClick, handlePointClose, false);
    //                 setupLatestPingOptions(latestPingsLayer, handlePointClick, handlePointClose, false);
    //                 // re-apply filters
    //                 if (filters.length) {
    //                     applyFiltersToPings(filters);
    //                 } else {
    //                     setPings(fetchedPings);
    //                 }
    //             }
    //         };
    //         update();
    //     }, [fetchedPings]);


    //     /**
    //    * when a map point is clicked,
    //    * populate the popup with metadata and show it
    //    */
    //     const handlePointClick = (event: L.LeafletEvent): void => {
    //         const layer = event.target;
    //         const feature: IBayiPoint = layer?.feature;
    //         console.log("handlePointClick")

    //         // setPopupInnerHTML(feature);
    //         // set the feature id state so bottom panel will highlight the row
    //         // setSelectedPingIDs([feature.id]);
    //     };

    //     /**
    //    * when the native leaflet popup (always hidden) is 'closed'
    //    */
    //     // todo: handle unselected pings
    //     const handlePointClose = (event: L.LeafletEvent): void => {

    //         console.log("handlePointClose")
    //         // hidePopup();
    //         // unhighlight them in bottom table
    //         // setSelectedPingIDs([]);
    //     };

    //     const applyFiltersToPings = (filters: ICodeFilter[]): void => {
    //         if (!filters.length) {
    //             // reset map state and bottom panel state
    //             setPings(fetchedPings);
    //             // redrawLayers();
    //             return;
    //         }
    //         const groupedFilters = groupFilters(filters);
    //         // console.log(groupedFilters, newFeatures.length);
    //         const filteredPings = applyFilter(groupedFilters, fetchedPings);

    //         setPings(filteredPings);
    //         redrawPings(filteredPings);
    //     };

    //     /**
    //    * clears existing pings/tracks layers, draws the new ones
    //    * @param newPings @param newTracks defaults to existing if not supplied
    //    */
    //     // const redrawLayers = (newPings = fetchedPings, newTowns = fetchedTowns): void => {
    //     //     clearLayers();
    //     //     const { latest, other } = splitPings(newPings);
    //     //     latestPingsLayer.addData(latest as any);
    //     //     pingsLayer.addData(other as any);
    //     //     townsLayer.addData(newTowns as any);
    //     //     if (showUnassignedLayers && fetchedUnassignedPings && fetchedUnassignedTracks) {
    //     //         const { latest, other } = splitPings(fetchedUnassignedPings, 'collar_id');
    //     //         unassignedTracksLayer.addData(fetchedUnassignedTracks as any);
    //     //         unassignedPingsLayer.addData(other as any);
    //     //         latestUPingsLayer.addData(latest as any);
    //     //     }
    //     // };

    //     // redraw only pings, if no params supplied it will default the fetched ones
    //     const redrawPings = (newPings: IBayiPoint[]): void => {
    //         const { latest, other } = splitPings(newPings);
    //         const layerPicker = L.control.layers();
    //         layerPicker.removeLayer(pingsLayer);
    //         layerPicker.removeLayer(latestPingsLayer);
    //         pingsLayer.clearLayers();
    //         latestPingsLayer.clearLayers();
    //         pingsLayer.addData(other as any);
    //         latestPingsLayer.addData(latest as any);
    //         selectedPingIDs.forEach((f) => fillPoint(f, true));
    //     };

    //     // clears existing pings/tracks layers
    //     const clearLayers = (): void => {
    //         const layerPicker = L.control.layers();
    //         const allLayers = [...getAssignedLayers()];
    //         allLayers.forEach((l) => {
    //             layerPicker.removeLayer(l);
    //             if (typeof (l as L.GeoJSON).clearLayers === 'function') {
    //                 (l as L.GeoJSON).clearLayers();
    //             }
    //         });
    //     };

    //     const getAssignedLayers = (): L.Layer[] => [latestPingsLayer, pingsLayer];

    return (
        <div className={styles.root}>
            <MapField pings={pings} />
            <MapSidebar bayilerData={fetchedBayiler} />
        </div>
    );
};

export default Map;