import { Request, Response, NextFunction } from 'express';
import { IDistributor, IUser } from '../interface';
import * as mongoose from 'mongoose';
import * as _ from 'lodash';
import * as fs from 'fs';
const path = require('path');
import { Distributor } from '../models/distributor.model';
import { User } from '../models/user.model';
import { readExcelFile } from '../helper/file';

import * as httpStatus from 'http-status';
const APIError = require('../utils/APIError');

import { setDistsToBayiler } from './bayi.controller';
import { District, IDistrict } from '../models/district.model';
import { Bayi } from '../models';
import { nextTick } from 'process';

declare global {
  interface String {
    turkishToLower(str: string): string;
    turkishToUpper(str: string): string;
  }
}

String.prototype.turkishToLower = function () {
  var string = this;
  var letters = { İ: 'i', I: 'ı', Ş: 'ş', Ğ: 'ğ', Ü: 'ü', Ö: 'ö', Ç: 'ç' };
  string = string.replace(/(([İIŞĞÜÇÖ]))/g, function (letter) {
    return letters[letter];
  });
  return string.toLowerCase();
};

String.prototype.turkishToUpper = function () {
  var string = this;
  var letters = { i: 'İ', ş: 'Ş', ğ: 'Ğ', ü: 'Ü', ö: 'Ö', ç: 'Ç', ı: 'I' };
  string = string.replace(/(([iışğüçö]))/g, function (letter) {
    return letters[letter];
  });
  return string.toUpperCase();
};

export async function olustur(req: Request, res: Response) {
  fs.readFile(path.resolve(__dirname, '.', 'asistan-net-distributor-son.json'), 'utf8', async (err, data) => {
    if (err) {
      res.json('hata');
    }
    let result = [];
    let dists: [] = JSON.parse(data);
    Object.keys(dists).map((distKey) => {
      result.push(dists[distKey]);
    });

    let users: IUser[] = [];
    let distributors: IDistributor[] = [];

    result.map((dist) => {
      let _distributor: any = {};
      _distributor._id = new mongoose.Types.ObjectId();
      _distributor.kod = dist.id;
      _distributor.name = dist.name;
      _distributor.bolge = dist.bolge;
      _distributor.bolgeKod = dist.bolgeKod;
      _distributor.status = true;
      let u = dist['cc'] || [];
      let _usersArray = [...u, ...dist['to']];
      // _distributor.userData = _usersArray;

      _distributor.users = [];

      _usersArray.map((user) => {
        let _user: any = {};
        _user._id = new mongoose.Types.ObjectId();
        _user.status = true;
        _user.distributor = _distributor._id;
        _user.name = user.name;
        _user.email = {
          address: user.address,
          name: user.name
        };
        users.push(_user);
        _distributor.users.push(_user._id);

        // users = users.lenght > 0 ? [...users, ..._usersArray] : _usersArray;
      });

      distributors.push(_distributor);

      // users = [...users, ...dist['cc'], ...dist['to']];
    });
    let distResult = await Distributor.insertMany(distributors);
    let userResult = await User.insertMany(users);
    res.json([distResult, userResult]);
    // res.json([distributors, users]);
  });
}

export async function sehir(req: Request, res: Response) {
  fs.readFile(path.resolve(__dirname, '.', 'bolge.json'), 'utf8', async (err, data) => {
    if (err) res.json('hata');

    let sehirler: any = JSON.parse(data);
    // let result = _.toArray(sehirler);
    let result = Object.keys(sehirler).map((key) =>
      Object.keys(sehirler[key]).map((_key) => ({ ilce: _key, il: parseInt(key), distler: sehirler[key][_key] }))
    );
    // Object.keys(sehirler).map(sehirKey => {
    //   let _ilceler : [] = sehirler[sehirKey];
    //   let _sehirIlceler = Object.keys(_ilceler).map((ilceAdi : any) => {
    //     _ilceler[ilceAdi].city = sehirKey;
    //     return _ilceler;
    //   });
    //   result = result.length > 0 ? [...result, ..._sehirIlceler] : _sehirIlceler;
    //   // result.push(_ilceler);
    // });

    // let data2 : any = fs.readFileSync(path.join(__dirname, 'plaka.json'), {encoding:'utf8', flag:'r'});
    // let result2 = [];
    // let parsedData = JSON.parse(data2).data;
    // result.map(ilce => {
    //   let _il : any = parsedData.find((sh : any) => sh.il == ilce.city);

    //   ilce.cityCode = _il?.plaka;
    //   result2.push(ilce);
    // })

    // let lastResult = await District.insertMany(result2)
    let result2: any = _.flatten(result);

    // try {
    //   result2.map(async (_bolge) => {
    //     let plaka = _bolge.il;
    //     let ilce = _bolge.ilce;
    //     let distler: [] = _bolge.distler;
    //     let bolge = await District.findOne({ cityCode: plaka, district: ilce });
    //     distler.map(async (_dist: any) => {
    //       let dist = await Distributor.findOne({ _id: _dist.id });

    //       dist.bolgeData.push(bolge);
    //       dist.save();
    //     });
    //   });
    // } catch (error) {
    //   res.json("hata")
    // }

    let grouped = {};

    let districts = await District.find({});

    result2.map((_bolge: any) => {
      _bolge.distler.map((_dist: any) => {
        grouped[_dist.id] = grouped[_dist.id]
          ? [
              ...grouped[_dist.id],
              {
                cityCode: _bolge.il,
                district: _bolge.ilce
              }
            ]
          : [
              {
                cityCode: _bolge.il,
                district: _bolge.ilce
              }
            ];
      });
    });

    Object.keys(grouped).map(async (distCode: any, index) => {
      let distBolgeler = grouped[distCode];

      let dist = await Distributor.findOne({ kod: parseInt(distCode) });
      distBolgeler = distBolgeler.map((_b) => {
        let district = districts.find((d) => d.district == _b.district && d.cityCode == _b.cityCode);
        return district;
      });

      dist.bolgeData = distBolgeler;
      dist.save();
    });

    res.json([grouped, districts]);
  });
}

// export async function transform(req: Request, res: Response) {
//   try {
//     fs.readFile(path.resolve(__dirname, '.', 'data.json'), 'utf8', async (err, data) => {
//       if (err) throw err;

//       let distData = JSON.parse(data);

//       let newData: [IDistributor] = <any>[];
//       let _users: IUser[] = <any>[];

//       let _data = Object.values(distData);
//       _data.map((dist: any, index: number) => {
//         let distCustomId = new mongoose.Types.ObjectId().toHexString();

//         let users = [...dist.to, ...dist.cc].map((_usr: IUser | any) => {
//           _usr._id = new mongoose.Types.ObjectId().toHexString();
//           _usr.distributor = [mongoose.Types.ObjectId(distCustomId)];
//           _usr.roleInMail = 'to';
//           _usr.taskName = 'Tanımsız';
//           _usr.email = {
//             name: _usr?.name,
//             address: _usr.address
//           };
//           delete _usr.address;
//           return _usr;
//         });
//         _users = [..._users, ...users];
//         newData[index] = {
//           _id: mongoose.Types.ObjectId(distCustomId),
//           bolge: dist.bolge,
//           bolgeKod: dist.bolgeKod,
//           bolgeler: dist.bolgeler,
//           name: dist.name,
//           status: dist.status,
//           kod: dist.id,
//           userData: users,
//           users: []
//         };
//       });

//       await User.insertMany(_users);

//       res.json(_users);
//     });
//   } catch (error) {
//     res.json(error);
//   }
// }

export async function setDist(req: Request, res: Response, next: NextFunction) {
  try {
    let distData: IDistributor[] = await readExcelFile();
    distData.map(async (dist: IDistributor) => {
      let users = dist.userData;
      let _distData = _.pick(dist, ['bolge', 'altBolge', 'bolgeKod', 'name', 'kod', 'bolgeData', 'users']);
      let distDoc: any = await Distributor.findOneAndUpdate({ kod: dist.kod }, _distData, { new: true, upsert: true });
      let userResult: any = users.map(async (user: IUser) => {
        user.distributor = distDoc._id;
        // user.distributor = distId;
        let _userDoc = await User.findOneAndUpdate({ 'email.address': user.email.address }, user, {
          new: true,
          upsert: true
        });
        distDoc.users.push({
          _id: _userDoc._id
        });
        return _userDoc;
      });
      Promise.all(userResult).then((r: any) => {
        distDoc.save();
      });
    });
    res.json(distData);
  } catch (err) {
    next(err);
  }
}

export async function setDistInfoToBayiler(req: Request, res: Response, next: NextFunction) {
  try {
    let dists = await Distributor.aggregate([
      {
        $project: {
          bolgeData: 1
        }
      }
    ]);
    let result: any[] = await dists.map(async (dist) => {
      let _dist = {
        id: dist._id,
        iller: _.union(_.map(dist['bolgeData'], 'il')),
        ilceler: _.union(_.map(dist['bolgeData'], 'ilce')),
        altBolge: _.union(_.map(dist['bolgeData'], 'altBolge'))
      };
      // return _dist
      return await setDistsToBayiler(_dist);
    });

    Promise.all(result)
      .then((ok) => {
        res.json(ok);
      })
      .catch((err) => {
        throw err;
      });
  } catch (err) {
    next(err);
  }
}

export async function getDistIdsByAdresRoute(req: Request, res: Response, next: NextFunction) {
  let { il, ilce } = <any>req.query;
  let iller = il ? il.split(',').map((_: any) => _.turkishToUpper()) : null;
  let result = await Distributor.getDistsIdByAdres(iller);
  res.json(result);
}

export async function getDistIdsByAdres(iller: string[]): Promise<mongoose.Types.ObjectId[]> {
  try {
    if (_.isEmpty(iller)) {
      throw new Error('Adres bilgisi bulunmuyor.');
    }
    return await Distributor.getDistsIdByAdres(iller);
  } catch (err) {
    throw new APIError({
      message: 'Dist bilgileri alınamadı'
    });
  }
}

export async function getDistAll(req: Request, res: Response, next: NextFunction) {
  try {
    // let { il } = <any>req.query;
    // let iller = il.split(',').map((_: any) => _.turkishToUpper());
    let dists = await Distributor.find({});
    // let dists = await getDistIdsByAdres(iller);
    res.json(dists);
  } catch (err) {
    next(err);
  }
};

export async function getDistByKod(kod : any){
  try {
    return (await Distributor.find({kod}).select("_id"));
  } catch (error) {
    return new Error(`${kod} kod numarası ile distributor bulunamadı`);
  }
}

// export async function usersSil(req, res, next){

//   let dists = await Distributor.find({});

//   let result = dists.map(dist => {
//     dist.users = null;
//     return dist.save();
//   });

//   res.json(result)
// }
