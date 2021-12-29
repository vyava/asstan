import { APP_URL, isServer } from "src/config"

export const assembleSeoUrl = (pathname?: string): string => {
  const host = isServer ? location.host : undefined;
  return `${host ? `https://${host}` : APP_URL}${pathname || ""}`;
};

export const getLocalStorage = (key : string) : string | null => {
  return (typeof window !== "undefined") ? window.localStorage.getItem(key) : null;
}

export const BAYILER_LIST_HEADERS = {
  //   il: "Şehir",
  //   ilce: "İlçe",
  //   sinif: "Sınıf",
    adiSoyadi: "Adı Soyadı",
    unvan: "Ünvan",
    ruhsatNo: "Ruhsat",
    adres: "Adres",
    vergiNo: "Vergi No"
};