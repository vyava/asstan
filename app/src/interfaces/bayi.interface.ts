export interface IBayi {
    il: string;
    ilce: string;
    sinif: string;
    adiSoyadi: string;
    unvan: string;
    ruhsatNo: string;
    adres: string;
    vergiNo: string;
    email?: string | Object;
    coords?: {
        lat: number;
        lng: number;
    };
    createdAt : Date;
    updatedAt : Date;
}