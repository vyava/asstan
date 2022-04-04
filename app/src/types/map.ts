import { GeoJsonObject, LineString, Point, Position, Polygon } from 'geojson';
import { IBayi, ITown } from '@shared/interfaces';

interface MapRange {
    start: string;
    end: string;
}

type BoundingBox = number[];
type Coordinate = {lat: number, lng: number};

type OnlySelectedCritters = {
    show: boolean;
    critter_ids: string[];
}

type PingGroupType = 'ilce' | 'sinif';
type DetailsSortOption = 'il' | 'ilce' | 'sinif' | 'durum';
type OnPanelRowSelect = (ids: number[]) => void;

interface LocationBase extends Coordinate {
    polygons : Position;
    boundingbox : BoundingBox
}

interface IBayiDetail {
    critter_id: string;
    mortality_date: Date;
    date_recorded: Date;
    device_vendor: string;
};

interface IBayiPoint extends GeoJsonObject {
    type: 'Feature';
    geometry: Point;
    id: string;
    coords : Coordinate;
    properties: IBayi;
}

interface ITownDetail extends LocationBase {
    name : string;
    city : string;
    districts : string[];
};

interface ITownLine extends GeoJsonObject {
    type: 'Feature',
    geometry: Polygon;
    id: number;
    properties: Pick<ITown, any>;
};

interface ITownQuery {
    city : string;
    town : string;
};

// represents a track
interface IBayiLine extends GeoJsonObject {
    type: 'Feature';
    properties: Pick<IBayiDetail, any>
    geometry: LineString
}

interface IUnassignedBayiLine extends GeoJsonObject {
    type: 'Feature';
    properties: Pick<IBayiDetail, any>
    geometry: LineString
}

// a grouped by critter_id version of @type {IBayiPoint} 
interface IBayiGroup {
    il: string;
    ilce: string;
    sinif: string;
    durum: string;
    count: number;
    features: IBayiPoint[];
}

// determines if a single coordinate array can be found in a group of coordinates
const doesPointArrayContainPoint = (pings: Position[], coord: Position): boolean => {
    for (let i = 0; i < pings.length; i++) {
        const ping = pings[i];
        if (ping[0] === coord[0] && ping[1] === coord[1]) {
            return true;
        }
    }
    return false;
}

const padFrequency = (num: number): string => {
    const freq = num.toString();
    const numDecimalPlaces = freq.slice(freq.lastIndexOf('.') + 1).length;
    const numToAdd = (3 - numDecimalPlaces) + freq.length;
    return freq.padEnd(numToAdd, '0');
}

export type {
    MapRange,
    ITownLine,
    ITownQuery,
    IBayiDetail,
    ITownDetail,
    OnPanelRowSelect,
    DetailsSortOption,
    OnlySelectedCritters,
    IBayiLine,
    IUnassignedBayiLine,
    IBayiPoint,
    IBayiGroup,
    PingGroupType,
    Coordinate
};

export {
    doesPointArrayContainPoint,
}