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
  distributor?: any;
  vergiNo? : string;
  createdAt?: string;
  updatedAt?: string;
  coords? : {
    lon : number;
    lat : number;
  };
  geometry : number[];
};