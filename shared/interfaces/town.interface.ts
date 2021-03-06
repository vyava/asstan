export interface ITown {
    _id? : any;
    name : string;
    city : string;
    districts : string[];
    geolocation : {
        lat : number;
        lng : number;
        polygons : [any[]],
        position : [number, number]
    };
    boundingbox : string[];
}