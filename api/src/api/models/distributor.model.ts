import { Model, Document, Schema, model, mongo } from 'mongoose';
import { IDistributor, IDistributorDocument, IIlce, DistRequest } from '../interface';


import '../models/user.model';

// const httpStatus = require('http-status');
import * as httpStatus from 'http-status';
// import { IBayiDocumentModel } from "./bayi.model";
const APIError = require('../utils/APIError');
// import * as APIError from "../utils/APIError"

interface DistributorStatic {
  getDistsIdByAdres(adres: string[]): any;
  getDistIdByKod(kod: string): any;
}
class DistributorStatic {
  static async getDistsIdByAdres(iller: string[]) {
    try {
      let distIds = await Distributor.aggregate([
        // {
        //   $unwind: '$bolgeData'
        // },
        {
          $match: {
            'bolgeData.city': {
              $in: iller
            }
          }
        },
        {
          $project : {
            bolgeData : 1,
            _id : 1
          }
        },
        {
          $unwind : '$bolgeData'
        },
        {
          $project : {
            _id : 0,
            'distId' : '$_id',
            'district': '$bolgeData.district',
            'districtCode': '$bolgeData.districtCode',
            'city': '$bolgeData.city',
            'cityCode': '$bolgeData.cityCode'
          }
        }
        // {
        //   $group : {
        //     _id : '$_id'
        //   }
        // }
        // {
        //   $group: {
        //     _id: null,
        //     city: {
        //       $first: '$bolgeData.city'
        //     },
        //     district: {
        //       $first: '$bolgeData.district'
        //     },
        //     distId: {
        //       $first: '$_id'
        //     },
        //     altBolge: {
        //       $first: '$altBolge'
        //     }
        //   }
        // }
      ]);
      return distIds;
    } catch (err) {
      throw new APIError(err);
    }
  };

  static async getDistIdByKod(kod : any){
    let _id : any = await Distributor.find({ kod }).select("_id");
    return _id[0]._id
  }
}

interface DistributorClass extends IDistributorDocument {
  
}

class DistributorClass extends Model {
  
};

export type DistributorModel = DistributorClass & Document;
type DistributorType = DistributorClass & DistributorStatic & Model<DistributorModel>;

const schema = new Schema<IDistributorDocument>(
  {
    name: { type: String, default: 'TANIMSIZ' },
    status: { type: Boolean, default: true },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    kod: {
      type: Number,
      required: true,
      unique: true,
      index: true
    },
    bolge: { type: String, default: 'TANIMSIZ' },
    // altBolge: { type: String, default: 'TANIMSIZ' },
    bolgeData: [
      {
        city: {
          type: String,
          uppercase: true,
          require: true
        },
        cityCode : {
          type : Number,
          require : true
        },
        district: {
          type: String,
          uppercase: true,
          require: true
        },
        districtCode: {
          type: Number,
          require: true
        },
      }
    ]
  },
  {
    collection: 'distributor',
    // toJSON : {
    //   transform : (doc, ret) => {
    //     delete ret._id
    //   }
    // },
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

schema.loadClass(DistributorStatic);
schema.loadClass(DistributorClass);

export const Distributor = model<DistributorModel>("Dist", schema) as DistributorType;