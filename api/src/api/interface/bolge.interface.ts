import { Document, Types } from "mongoose";
import { IDistributorShort } from "./distributor.interface";


export type IBolgeDocument = Document & IBolge;

export interface IBolge {
    il           : string;
    ilce?        : IIlce[];
    altBolge?    : string;
    bolgeKod?    : number;
}

export interface IIlce {
    name : string;
    distributor : Types.ObjectId[]
}