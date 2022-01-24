import { Model, Document, Schema, model } from "mongoose";
import { IDataRaw, IDataRawDocument } from "../interface/data_raw.interface";

interface DataRawStatic {
    saveData(data : IDataRaw[]): Promise<any>;
};

class DataRawStatic {
  static async saveData(data : IDataRaw[]) {
    return DataRaw.insertMany(data);
  }
}

/**
 * @typedef DataRaw
 */

export type DataRawModel = Document;
type DataRawType = DataRawStatic & Model<DataRawModel>;

/**
 * Bayi Schema
 * @private
 */
const schema = new Schema<IDataRawDocument>(
  {
    Ad: { type : String },
    AdSoyad: { type : String },
    BasvuruNo: { type : String },
    BasvuruTurRefId: { type : Number },
    DegreeSicilNo: { type : String },
    FiiliDurumRefId: { type : Number },
    FiiliDurumu: { type : String },
    Id: { type : Number },
    IkametAdres: { type : String },
    IlAdi: { type : String },
    IlRefId: { type : Number },
    IlceAdi: { type : String },
    IlceRefId: { type : Number },
    Kilit: { type : String },
    MulkuAmirOnayAciklama: { required : false },
    MulkuAmirOnayTarihi: { type : String },
    PasaportNo: { required : false },
    SaticiSinifRefId: { type : Number },
    SaticiSinifiAdi: { type : String },
    SaticiTur: { type : String },
    SaticiTurRefId: { type : Number },
    SicilNo: { type : String },
    Soyad: { type : String },
    TCKimlikNo: { type : String },
    Unvan: { type : String },
    VergiNo: { type : String },
    coords : {
        auto : [ { type : String, enum : ["Point"] } ],
        verified : [ { type : String, enum : ["Point"] } ]
    }
  },
  {
    collection: "data_raw",
    // timestamps : {
    //   createdAt : "createdAt",
    //   updatedAt : "updatedAt"
    // }
  }
);

schema.loadClass(DataRawStatic);

export const DataRaw = model<DataRawModel>("DataRaw", schema) as DataRawType
export default DataRaw;