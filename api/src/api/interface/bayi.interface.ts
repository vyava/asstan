import { Document, Types } from "mongoose";
import { IDistributor, IDistributorDocument } from "./distributor.interface";

export type IBayiDocument = Document & IBayi;

export interface IBayi {
  ilRefId? : number;
  il?: string;
  ilceRefId? : number;
  ilce?: string;
  ruhsatNo?: string;
  // ruhsatTipleri?: string[] | string;
  adi?: string;
  soyadi?: string;
  adiSoyadi?: string;
  unvan?: string;
  sinif?: string;
  sinifDsd?: string;
  adres?: string;
  konum? : string;
  durum?: string;
  distributor?: Types.ObjectId[] | [{ name: string }];
  vergiNo? : string;
  createdAt?: string;
  updatedAt?: string;
  coords? : Object;
};

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