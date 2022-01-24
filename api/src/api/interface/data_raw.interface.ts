import { Document, Types } from "mongoose";

export type IDataRawDocument = Document & IDataRaw;

interface Point {
    type : string;
    coordinates : [];
};

interface Coordinate {
    auto : Point[];
    verified : Point[];
};

export interface IDataRaw {
    Ad: string;
    AdSoyad: string
    BasvuruNo: string;
    BasvuruTurRefId: number
    DegreeSicilNo: string
    FiiliDurumRefId: number
    FiiliDurumu: string
    Id: number
    IkametAdres: string
    IlAdi: string
    IlRefId: number
    IlceAdi: string
    IlceRefId: number
    Kilit: string
    MulkuAmirOnayAciklama: any
    MulkuAmirOnayTarihi: string
    PasaportNo: any
    SaticiSinifRefId: number
    SaticiSinifiAdi: string
    SaticiTur: string
    SaticiTurRefId: number
    SicilNo: string
    Soyad: string
    TCKimlikNo: string
    Unvan: string
    VergiNo: string
    coords : Coordinate
};