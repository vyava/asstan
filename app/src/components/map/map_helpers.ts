import * as L from "leaflet";
import { FormStrings } from 'src/constants/strings';
import dayjs from 'dayjs';
import { ICodeFilter, IGroupedCodeFilter } from 'src/types/code';
import {
    DetailsSortOption,
    IBayiDetail,
    IBayiPoint,
    IBayiGroup,
    IBayiLine,
    doesPointArrayContainPoint,
    PingGroupType,
    Coordinate,
} from 'src/types/map';
import { IBayi } from 'src/interfaces/bayi.interface';
import { Position } from "geojson";

const MAP_COLOURS = {
    point: '#00ff44',
    track: '#00a9e6',
    selected: '#ffff00',
    'selected polygon': '#00a9e6',
    'unassigned point': '#b2b2b2',
    'unassigned line segment': '#828282',
    malfunction: '#ffaa00',
    mortality: '#e60000',
    outline: '#fff'
};

const MAP_COLOURS_OUTLINE = {
    point: '#686868',
    selected: '#000000',
    'unassigned point': '#686868',
    malfunction: '#000000',
    mortality: '#ffaa00'
};

/**
 * @param data the @type {Object}
 * @returns a @type {L.Point} feature
 */

const latlngToGeoJSONObject = (data: any = {} as any, coords : any = {}) => {
    
    return {
        "type": "Feature",
        "properties": data,
        "geometry": {
            "type": "Point",
            "coordinates": [parseFloat(coords?.lat), parseFloat(coords?.lng)]
        }
    }
}

/**
 * @param colourString the @type {Animal} animal_colour string
 * which in the @file {map_api.ts} -> @function {getPings} is returned
 * in a concatted format of `${fill_collour},${border_colour}`
 * @returns an object with point border and fill colours
 */
const parseAnimalColour = (colourString: string): { fillColor: string; color: string } => {
    if (!colourString) {
        return { fillColor: MAP_COLOURS['unassigned point'], color: MAP_COLOURS['unassigned point'] };
    }
    const s = colourString.split(',');
    return { fillColor: s[0], color: s[1] };
};

/**
 * @returns the hex colour value to show as the fill colour
 */
const getFillColorByStatus = (point: IBayiPoint, selected = false): string => {
    if (selected) {
        return MAP_COLOURS.selected;
    }
    if (!point) {
        return MAP_COLOURS.point;
    }
    const { properties } = <any>point;
    if (properties?.animal_status === 'Mortality') {
        const { date_recorded, mortality_date } = properties;
        // if the mortality date is not set, fill all points red
        // otherwise only fill points red after the mortality date
        if (!mortality_date || dayjs(date_recorded) > dayjs(mortality_date)) {
            return MAP_COLOURS.mortality;
        }
    } else if (properties?.device_status === 'Potential Mortality') {
        return MAP_COLOURS.malfunction;
    }
    return parseAnimalColour(properties.map_colour)?.fillColor ?? MAP_COLOURS.point;
};

// same as getFillColorByStatus - but for the point border/outline color
const getOutlineColor = (feature: IBayiPoint | any): string => {
    if (feature.id < 0) {
        return MAP_COLOURS_OUTLINE['unassigned point'];
    }
    const colour = feature?.properties?.map_colour;
    return colour ? parseAnimalColour(colour)?.color : MAP_COLOURS.outline;
};

/**
 * sets the @param layer {setStyle} function
 */
const fillPoint = (layer: any, selected = false): void => {
    // dont style tracks or invalid points
    if (!layer.feature || layer.feature?.geometry?.type === 'LineString' || typeof layer.setStyle !== 'function') {
        return;
    }
    layer.setStyle({
        class: selected ? 'selected-ping' : '',
        weight: 1.0,
        color: getOutlineColor(layer.feature),
        fillColor: getFillColorByStatus(layer.feature, selected)
    });
};

/**
 * @param pings list of Bayi features to group
 * @param sortOption applied after the features are gruped by critter_id
 * @returns @type {IBayiGroup}
 */
const groupPings = (
    pings: IBayiPoint[],
    sortOption?: DetailsSortOption,
    groupBy: PingGroupType = 'sinif',
): IBayiGroup[] => {
    const uniques: IBayiGroup[] = [];
    if (!pings.length) {
        return uniques;
    }
    // filter out the (0,0) points
    const filtered = pings.filter((f) => {
        const coords = f.geometry.coordinates;
        return coords[0] !== 0 && coords[1] !== 0;
    });
    filtered.forEach((f) => {
        const detail: IBayiDetail | any = f.properties;
        const found = uniques.find((c) => c[groupBy] === detail[groupBy]);
        if (!found) {
            uniques.push({
                il: detail.il,
                ilce: detail.ilce,
                sinif: detail.sinif,
                durum: detail.durum,
                count: 1,
                features: [f]
            });
        } else {
            found.count++;
            found.features.push(f);
        }
    });
    // @ts-ignore
    const sorted = uniques.sort((a: any, b) => a[sortOption] - b[sortOption]);
    return sorted;
};

/**
 * accepts a list of filters, a list of objects that contain:
 * a) the code header
 * b) a string array of descriptions.
 * @param filters the ungrouped filters
 * @returns @type {IGroupedCodeFilter} array
 */
const groupFilters = (filters: ICodeFilter[]): IGroupedCodeFilter[] => {
    const groupObj: any = {};
    filters.forEach((f) => {
        if (!groupObj[f.code_header]) {
            groupObj[f.code_header] = [f.description];
        } else {
            groupObj[f.code_header].push(f.description);
        }
    });
    return Object.keys(groupObj).map((k) => {
        return { code_header: k, descriptions: groupObj[k] };
    });
};

/**
 * @param groupedFilters a list of filters that have been grouped into @type {IGroupedCodeFilter}
 * @param features the feature list to apply the filters to
 * @returns a filtered list of features that have one or more of the filters applied
 */
const applyFilter = (groupedFilters: IGroupedCodeFilter[], features: IBayiPoint[]): IBayiPoint[] => {
    return features.filter((f) => {
        const { properties } = f;
        for (let i = 0; i < groupedFilters.length; i++) {
            const { code_header, descriptions } = groupedFilters[i];
            // @ts-ignore
            const featureValue = properties[code_header];
            // when the 'empty' value is checked in a filter, and a feature value is not set
            if (descriptions.includes(FormStrings.emptySelectValue) && (featureValue === '' || featureValue === null)) {
                return true;
            }
            if (!descriptions.includes(featureValue)) {
                return false;
            }
        }
        return true;
    });
};

/**
 * @param array features to sort
 * @param comparator the comparator function
 * @returns the sorted @type {IBayiGroup}
 */
// function sortGroupedBayi(array: IBayiGroup[], comparator: (a: any, b: any) => number): IBayiGroup[] {
//     const stabilizedThis = array.map((el, idx) => [el.features[0].properties, idx] as [IBayiDetail, number]);
//     stabilizedThis.sort((a, b) => {
//         const order = comparator(a[0], b[0]);
//         if (order !== 0) return order;
//         return a[1] - b[1];
//     });
//     // @ts-ignore
//     const identifiers = stabilizedThis.map((a) => a[0].device_id /* a[0].critter_id ?? a[0].collar_id */);
//     const ret = [];
//     for (let i = 0; i < identifiers.length; i++) {
//         const foundIndex = array.findIndex((a) => a.ilce /*a.ilce ?? a.collar_id*/ === identifiers[i]);
//         ret.push(array[foundIndex]);
//     }
//     return ret;
// }

/**
 * @param u list of grouped features @type {IBayiGroup}
 * @returns unique feature IDs within the group
 */
const getPointIDsFromBayiGroup = (u: IBayiGroup[]): number[] => {
    // @ts-ignore
    return u.map((uf) => uf.features.map((f) => f.id)).flatMap((x) => x);
};

/**
 * groups features by @property {critter_id}, and returns an array of unique critter_ids
 */
// const getUniqueCritterIDsFromSelectedPings = (features: IBayiPoint[], selectedIDs: number[]): string[] => {
//     const grped = groupPings(features.filter((f) => selectedIDs.includes(f.id)));
//     return grped.map((g) => g.critter_id);
// };

/**
 * @returns a single feature that contains the most recent date_recorded
 */
const getLatestPing = (features: IBayiPoint[]): IBayiPoint => {
    return features.reduce((accum, current) => {
        return dayjs(current.properties.createdAt).isAfter(dayjs(accum.properties.createdAt)) ? current : accum;
    });
};

/**
 * @returns a single feature that contains the oldest date_recorded
 */
const getEarliestPing = (features: IBayiPoint[]): IBayiPoint => {
    return features.reduce((accum, current) => {
        return dayjs(current.properties.createdAt).isBefore(dayjs(accum.properties.createdAt)) ? current : accum;
    });
};

// groups the param features by critter, returning an object containing:
// an array of the most recent pings
// an arrya of all other pings
const splitPings = (pings: IBayiPoint[], splitBy: PingGroupType = 'ilce'): { latest: IBayiPoint[]; other: IBayiPoint[] } => {
    // @ts-ignore
    const gp = groupPings(pings, null, splitBy);
    const latest = getLatestPingsFromBayiGroup(gp);
    const latestIds = latest.map((l) => l.id);
    const other = pings.filter((p) => !latestIds.includes(p.id));
    return { latest, other };
};

// returns an array of the latest ping for each Bayi group
const getLatestPingsFromBayiGroup = (grouped: IBayiGroup[]): IBayiPoint[] => {
    const latestPings: any = [];
    grouped.forEach((g) => {
        latestPings.push(getLatestPing(g.features));
    });
    return latestPings;
};

/**
 * @returns an object containing the most recent 9?10? pings and tracks
 */
const getLast10Fixes = (
    pings: IBayiPoint[],
    // tracks: IBayiLine[]
): { pings: IBayiPoint[]; } => {
    const pingsGroupedByCritter = groupPings(pings);
    const newPings = getLast10Points(pingsGroupedByCritter);
    // const newTracks = getLast10Tracks(groupPings(newPings), tracks);
    return {
        pings: newPings,
        // tracks: newTracks
    };
};

/**
 * returns the most recent 9 Bayi points per critter group
 * since the latest ping is stored in a separate layer
 */
const getLast10Points = (group: IBayiGroup[]): IBayiPoint[] => {
    const ret = [];
    for (let i = 0; i < group.length; i++) {
        const features = group[i].features;
        // skip if there are under 10 pings available
        if (features.length <= 9) {
            ret.push(...features);
            continue;
        }
        const sorted = features.sort((a, b) => {
            return new Date(b.properties.createdAt).getTime() - new Date(a.properties.createdAt).getTime();
        });
        const last10 = sorted.slice(0, 10);
        ret.push(...last10);
    }
    return ret;
};

/**
 *
 * @param groupedPings critter groups - assumes pings have already been filtered to the last 10 fixes
 * @param originalTracks - unaltered API fetched tracks
 * @returns a new array of @type {IBayiLine} where the @property {geometry} coordinates
 * are filtered to only those contained in the ping
 *
 * note: for a given critter/date_recorded, a @property {IBayiLine.geometry.coordinates}
 * is the same as @property {IBayiPoint.geometry.coordinates},
 * the only difference is how Leaflet displays them!
 */
// const getLast10Tracks = (
//     groupedPings: IBayiGroup[],
//     originalTracks: IBayiLine[]
// ): IBayiLine[] => {
//     const newTracks: IBayiLine[] = [];
//     groupedPings.forEach((e) => {
//         const critterPingCoordinates = e.features.map((p) => p.geometry.coordinates);
//         const matchingTrack = originalTracks.find((t) => t.properties.critter_id === e.critter_id);
//         if (!matchingTrack) {
//             return;
//         }
//         const matchingTrackCoords = matchingTrack.geometry.coordinates;
//         const filteredTrackCoords = matchingTrackCoords.filter((c) =>
//             doesPointArrayContainPoint(critterPingCoordinates, c)
//         );

//         const newTrack = Object.assign({}, matchingTrack);
//         newTrack.geometry = { type: matchingTrack.geometry.type, coordinates: filteredTrackCoords };

//         newTracks.push(newTrack);
//     });
//     return newTracks;
// };

/**
 * @param position an object contains {lat, lng} @type {Coordinate}
 * @returns an array @type {Position}
 */
const getPositionFromCoords = (position : Coordinate) : Position => {
    return [position?.lat, position?.lng];
};

export {
    applyFilter,
    fillPoint,
    getPointIDsFromBayiGroup,
    getEarliestPing,
    getOutlineColor,
    getFillColorByStatus,
    getLatestPingsFromBayiGroup,
    getLast10Fixes,
    getLast10Points,
    // getLast10Tracks,
    getLatestPing,
    // getUniqueCritterIDsFromSelectedPings,
    groupPings,
    groupFilters,
    MAP_COLOURS,
    MAP_COLOURS_OUTLINE,
    parseAnimalColour,
    // sortGroupedBayi,
    splitPings,
    latlngToGeoJSONObject,
    getPositionFromCoords
};