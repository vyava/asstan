export interface ITown {
    name: string;
    city: any;
    districts : string[];
    geolocation: {
        lat : number;
        lon : number;
        polygons : [number[]];
        boundingbox : string[];
    },
    position : [number, number]
}