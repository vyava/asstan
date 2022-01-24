import { Model, Document, Schema, model, Types } from "mongoose";
// const bcrypt = require('bcryptjs');
// const moment = require('moment-timezone');
// const uuidv4 = require('uuid/v4');
// const APIError = require('../utils/APIError');
import { IBayiDocument, IBayi } from '../interface';


/**
 * Bayi Roles
 */
const roles = ['user', 'admin'];

interface BayiStatic {
  findAllBayis(): Promise<IBayiDocument[]>;
  findBayilerBySehir(sehir: string): Promise<IBayiDocument[]>;
  findBayilerByUpdatedAt(start: any): Promise<IBayiDocument[]>;
  newBayi(bayi: IBayi): Promise<IBayiDocument>;
  findWithCoords(distributor: any, page, limit): Promise<IBayiDocument[]>;
};

class BayiStatic {
  static findAllBayis() {
    return Bayi.find({});
  };
  static async findBayilerBySehir(sehir: string) {
    return Bayi.find({ il: sehir }).limit(20);
  }

  static async findBayilerByUpdatedAt(start) {
    return Bayi.find({
      updatedAt: {
        $gte: start
      },
    })
  };

  static async newBayi(bayi: IBayi) {
    let result = Bayi.findOneAndUpdate({
      ruhsatNo: bayi.ruhsatNo
    }, bayi, { upsert: true });

    return result;
  };

  static async findWithCoords(distributor, page, limit) {
    let result = Bayi.find({
      distributor: {
        $in: distributor
      },
      coords: {
        $ne: null
      }
    })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    return result;
  }
}

interface BayiClass extends IBayiDocument {
  getBayiByRuhsatNo(ruhsatNo: string): IBayiDocument;
};

class BayiClass extends Model {
  getBayiByRuhsatNo(ruhsatNo: string) {
    return this.find({ ruhsatNo });
  };
}

/**
 * @typedef Bayi
 */

export type BayiModel = BayiClass & Document;
type BayiType = BayiClass & BayiStatic & Model<BayiModel>;

/**
 * Bayi Schema
 * @private
 */
const schema = new Schema<IBayiDocument>(
  {
    il: { type: String, uppercase: true },
    ilRefId: { type: Number, uppercase: true },
    ilce: { type: String, uppercase: true },
    ilceRefId: { type: Number, uppercase: true },
    ruhsatNo: { type: String, index: true, unique: true },
    adiSoyadi: {
      type: String,
      trim: true
    },
    adi: { type: String },
    soyadi: { type: String },
    unvan: { type: String, trim: true },
    sinif: { type: String, trim: true },
    sinifDsd: { type: String, trim: true },
    adres: { type: String, trim: true },
    durum: { type: String, trim: true },
    vergiNo: { type: String, min: 10, max: 11 },
    distributor: [{ type: Schema.Types.ObjectId, ref: 'Dist' }],
    coords : {
      lat : {
        type : String
      },
      lng : {
        type : String
      }
    }
    // ruhsatTipleri: { type: String },
    // updatedAt: { type: Date },
    // createdAt: { type: Date }
  },
  {
    collection: "bayiler",
    // timestamps : {
    //   createdAt : "createdAt",
    //   updatedAt : "updatedAt"
    // }
  }
);

schema.loadClass(BayiStatic);
schema.loadClass(BayiClass);

export const Bayi = model<BayiModel>("Bayi", schema) as BayiType
export default Bayi;