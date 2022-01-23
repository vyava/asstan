import { Type, Expose } from 'class-transformer';
import { GeoJsonObject, LineString, Point, Position } from 'geojson';
import { columnToHeader } from 'src/utils/common_helper';
import { Code } from './code';

interface MapRange {
    start: string;
    end: string;
}

type OnlySelectedCritters = {
    show: boolean;
    critter_ids: string[];
}

type PingGroupType = 'critter_id' | 'collar_id';
type DetailsSortOption = 'wlh_id' | 'device_id' | 'frequency' | 'date_recorded';
type OnPanelRowSelect = (ids: number[]) => void;

interface ITelemetryDetail extends ICollarTelemetryBase {
    critter_id: string;
    mortality_date: Date;
    date_recorded: Date;
    device_vendor: string;
}

export interface ICollarBase {
    readonly collar_id: any;
  }
  export interface ICollarTelemetryBase extends ICollarBase {
    device_id: number;
    device_status: Code;
    frequency: number;
  }

interface ITelemetryPoint extends GeoJsonObject {
    type: 'Feature';
    geometry: Point;
    id: number;
    properties: ITelemetryDetail;
}

// represents a track
interface ITelemetryLine extends GeoJsonObject {
    type: 'Feature';
    properties: Pick<ITelemetryDetail, any>
    geometry: LineString
}

interface IUnassignedTelemetryLine extends GeoJsonObject {
    type: 'Feature';
    properties: Pick<ITelemetryDetail, any>
    geometry: LineString
}

// a grouped by critter_id version of @type {ITelemetryPoint} 
interface ITelemetryGroup {
    collar_id: string;
    critter_id: string;
    device_id: number;
    frequency: number;
    count: number;
    features: ITelemetryPoint[];
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
    ITelemetryDetail,
    MapRange,
    OnPanelRowSelect,
    DetailsSortOption,
    OnlySelectedCritters,
    ITelemetryLine,
    IUnassignedTelemetryLine,
    ITelemetryPoint,
    ITelemetryGroup,
    PingGroupType,
};

export {
    doesPointArrayContainPoint,
}