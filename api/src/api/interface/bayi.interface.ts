import { Document } from "mongoose";
import { IBayi } from "@shared/interfaces";

export type IBayiDocument = Document & IBayi;

export enum IBayiIndex {
    İL            = 0,
    İLÇE,
    RUHSAT_NO,
    ADI,
    SOYADI,
    ÜNVAN,
    SINIF,
    ADRES,
    DURUM  
}