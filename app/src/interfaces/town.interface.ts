import { Position } from "geojson";

export interface ITown {
    _id? : any;
    name : string;
    city : string;
    districts : string[];
    geolocation : {
        lat : string;
        lng : string;
        polygons : [Position[]]
    };
    boundingbox : string[];
}