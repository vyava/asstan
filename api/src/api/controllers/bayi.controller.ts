import { NextFunction, Request, Response } from 'express';
const httpStatus = require('http-status');
const APIError = require('../utils/APIError');
import { isEmpty } from "lodash";
import "../models/bayi.model"
import { Distributor } from "../models/distributor.model";
import { getDate } from "../helper/date";
import { Bayi as BayiModel } from "../models/bayi.model";
import * as moment from "moment";
import * as rq from "request-promise";
import { IUser } from '../interface';
import { createExcelFile } from '../helper/excel';
import { ExcelSetup } from '../../config/file.vars';


export async function newBayi(req: Request, res: Response, next: NextFunction) {
  try {
    let bayi = await BayiModel.newBayi({
      adi: "test",
      soyadi: "string",
      adiSoyadi: "string",
      unvan: "string",
      vergiNo: "11",
      ruhsatNo: "453434PPT"
    });

    return bayi.save().then(_result => res.json(_result)).catch(err => {
      console.log("hata")
      throw new Error(err)
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get user
 * @public
 */

export async function getBayilerBySehir(req: Request, res: Response, next: NextFunction) {
  try {
    let sehir = req.param('sehir');
    let bayiler = await BayiModel.findBayilerBySehir(sehir);

    if (isEmpty(bayiler)) throw new APIError({
      message: "Bayi bulunamadı",
      code: httpStatus.NO_CONTENT
    });

    res.send(bayiler);

  } catch (err) {
    next(err)
  }
};

export async function getBayiById(req: Request, res: Response, next: NextFunction) {
  let id = req.params.id
  res.json(await BayiModel.findOne({ _id: id }));
}

export async function getBayilerByUpdatedAt(req: Request, res: Response, next: NextFunction) {
  try {
    let { start } = getDate("BUGÜN");

    let bayiler = await BayiModel.findBayilerByUpdatedAt(start);

    res.json(bayiler);
  } catch (err) {
    throw new APIError({
      message: "Belirtilen tarih ile bayi bulunamadı",
      detail: err
    })
  }
};

export async function getBayilerByTapdk(req: Request, res: Response) {
  let data = await getBayilerByGroup("BUGÜN");
  res.json(data);
}

export async function getBayilerByGroup(gun?: string, kod?: string | number) {
  try {
    let _g = gun || "dun";
    let { start, end } = getDate(_g, "mail");

    let distKod = kod ? await Distributor.getDistIdByKod(kod.toString()) : null

    const _in = kod ? {
      $exists: true,
      $ne: null,
      $in: [distKod]
    } : {
      $exists: true,
      $ne: null,
    };

    const bayiler = await BayiModel.aggregate([
      {
        $match: {
          $and: [
            {
              updatedAt: {
                $gte: start
              }
            },
            {
              updatedAt: {
                $lte: end
              }
            },
            {
              distributor: {
                ..._in
              }
            }
          ]
        }
      },
      {
        $sort: {
          "distributor._id": 1,
          durum: 1
        }
      },
      // { $limit: 100 },
      {
        $lookup: {
          from: "distributor",
          let: { "distId": "$distributor" },
          pipeline: [
            {
              $match: { $expr: { $in: ["$_id", "$$distId"] } },
            }
          ],
          as: "distributor"
        }
      },
      {
        $unwind: "$distributor"
      },
      {
        $group: {
          _id: {
            id: "$distributor._id",
            users: "$distributor.users",
            distName: "$distributor.name"
          },
          bayiler: {
            $push: {
              il: "$il",
              ilce: "$ilce",
              ruhsatNo: "$ruhsatNo",
              ruhsatTipleri: "$ruhsatTipleri",
              adiSoyadi: "$adiSoyadi",
              unvan: "$unvan",
              sinif: "$sinif",
              sinifDsd: "$sinifDsd",
              adres: "$adres",
              durum: "$durum",
              vergiNo: "$vergiNo",
              createdAt: "$createdAt",
              updatedAt: "$updatedAt"
            }
          }
        }
      },
      {
        $project: {
          "users": "$_id.users",
          "_id": 0,
          "bayiler": 1,
          "distName": "$_id.distName",
        }
      },
      {
        $lookup: {
          from: "users",
          let: { "userId": "$users" },
          pipeline: [
            {
              $match: { $expr: { $in: ["$_id", "$$userId"] } },
            },
            {
              $project: {
                "name": "$email.name",
                "address": "$email.address",
                // "email.name" : 1,
                // "email.address" : 1,
                _id: 0
              }
            }
          ],
          as: "users"
        }
      },
    ]);


    return bayiler;
  } catch (err) {
    throw err;
  }
}

// export async function setValueToBayiler(req: Request, res: Response, next: NextFunction) {
//   try {
//     let bulk = BayiModel.collection.initializeUnorderedBulkOp();
//     // let { start } = getDate("AYBAŞI", "some");
//     bulk.find({
//       // ilce : "KARTAL"
//     })
//       .update({
//         $set: {
//           createdAt: moment().startOf("month").toDate()
//         }
//         // $unset: {
//         //   // distributor: 1,
//         //   // altBolge : 1,
//         //   // createdAt : start,
//         //   ruhsatTipleri : 1
//         //   // updatedAt: start
//         // },
//       });
//     bulk.execute((err : any, result) => {
//       if (err) throw new APIError({
//         message: "bulk işlemi başarısız",
//         detail: err
//       })
//       res.json(result)
//     })
//   } catch (err) {
//     next(err)
//   }
// }

export async function setDistsToBayiler(dist: any) {
  try {
    let { id, iller, ilceler, altBolge } = dist
    let bulk = BayiModel.collection.initializeUnorderedBulkOp();
    bulk.find({
      $and: [
        {
          il: {
            $in: iller
          }
        },
        {
          ilce: {
            $in: ilceler
          }
        }
      ]
    }).update({
      $push: {
        distributor: {
          "_id": id
        }
      },
      // $set: {
      //   altBolge: altBolge[0]
      // }
    });
    return await bulk.execute()

  } catch (err) {
    throw new Error(err)
  }
};

export async function updateBayiler(bayiler: any[]) {
  try {

    let date = new Date();
    let updateBulk = BayiModel.collection.initializeUnorderedBulkOp();

    bayiler.map((bayi) => {
      updateBulk
        .find({
          ruhsatNo: bayi.ruhsatNo
        })
        .upsert()
        .updateOne({
          $setOnInsert: {
            createdAt: date
          },
          $set: {
            ruhsatTipleri: bayi.ruhsatTipleri,
            il: bayi.il,
            ilce: bayi.ilce,
            adiSoyadi: bayi.adiSoyadi,
            adi: bayi.adi,
            soyadi: bayi.soyadi,
            unvan: bayi.unvan,
            sinif: bayi.sinif,
            sinifDsd: bayi.sinifDsd,
            adres: bayi.adres,
            durum: bayi.durum,
            vergiNo: bayi.vergiNo,
            updatedAt: date,
            distributor: bayi.distributor
          }
        });
    });

    return new Promise(async (resolve, reject) => {

      updateBulk.execute({}, function (err, result) {
        if (err) reject(err);
        resolve(result)
      })
    })

  } catch (err) {
    throw err;
  }
};

/**
 * @api {get} v1/bayiler
 * @apiDescription Retrive bayiler
 * @apiVersion 1.0.0
 * @apiPermission <USER>
 *
 * @apiHeader {String} Athorization  User's access token
 *
 * @apiSuccess (200) Successfully retrieved
 *
 * @apiError (Unauthorized 401) Unauthorized  Only authenticated users can delete the data
 * @apiError (Forbidden 403)    Forbidden     Only user with same id or admins can delete the data
 * @apiError (Not Found 500)    NotFound      Bayi bulunamadı
 * **/
export async function getBayiler(req: Request, res: Response, next: NextFunction) {
  // destructure page and limit and set default values
  const { page = 1, limit = 40 }: any = req.query;
  //@ts-ignore
  let user: IUser = req.user;

  try {

    const data = await BayiModel.findWithCoords(user.distributor, page, limit);

    // const count: any = data.length > 0 ? (await BayiModel.count()) : 0;

    console.log("COUNT : "+data.length)

    res.json({
      data: data,
      // totalPages: Math.ceil(count / limit),
      // totalPages : 12,
      currentPage: page
    });
    
  } catch (error) {
    next(error)
  }
}

export async function downloadBayiler(req: Request, res: Response, next: NextFunction) {
  try {
    // destructure page and limit and set default values
    const { page, limit}: any = req.body;
    //@ts-ignore
    let user: IUser = req.user;

    let data = [];
    
    // Download the current page
    if(!!page && !!limit){
      data = await BayiModel.find({
        distributor: {
          $in: user.distributor
        }
      })
        .limit(limit * 1)
        .skip((page - 1) * limit);
    }else{
      data = await BayiModel.find({
        distributor: {
          $in: user.distributor
        }
      });
    }

    let filePath = await createExcelFile(ExcelSetup, data);

    // res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    // res.setHeader("Content-disposition", "attachment; filename=file.xlsx")
    console.log(filePath)
    res.json(filePath);

  } catch (error) {
    next(error)
  }
}

export async function getBayiByRuhsatNo(req: Request, res: Response, next: NextFunction) {
  try {
    let ruhsatNo: any = req.query.ruhsatNo;
    let bayi = await (await BayiModel.findOne({ ruhsatNo: ruhsatNo }).populate({
      path: "distributor",
      select: "-bolgeData -id -created_at -updated_at",
      // populate : {
      //   path : "users",
      //   select : "email"
      // }
    }));

    if (isEmpty(bayi)) throw new APIError({
      message: "Bayi bulunamadı",
      code: httpStatus.NOT_FOUND
    });
    res.send(bayi)
  } catch (err) {
    next(err)
  }

}