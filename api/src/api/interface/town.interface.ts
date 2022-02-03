import { ObjectId } from 'mongoose';
import { DeepOmit } from "./common.interface";
type GeolocationProps = "lat" | "lng" | "polygons" | "boundingbox";

export interface ITownBaseType {
    name: string;
    city: string;
    districts : string[];
    geolocation: {
        lat : number;
        lng : number;
        polygons : [number[]];
        boundingbox : string[];
    },
    position : [number, number]
};

export type ITown = DeepOmit<ITownBaseType, ["polygons", "boundingbox"]>;