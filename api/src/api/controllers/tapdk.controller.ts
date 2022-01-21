import { Request, Response, NextFunction } from 'express';
import { getSourceFromExternal } from '../helper/tapdk';
// import { findTaskById, taskDone, taskError, taskBlock } from './task.controller';
import { Types } from 'mongoose';
import * as moment from 'moment';
import { updateBayiler } from './bayi.controller';
import { getDistIdsByAdres } from './dist.controller';
import * as _ from 'lodash';
import { IBayi, IBayiTapdk, IDistributorShort } from '../interface';
// import { getDate } from '../helper/date';
/**
 * Get distributor
 * @public
 */

async function getSource(req: Request, res: Response, next: NextFunction) {
  try {
    let { params, taskId } = req.body;
    let gun = params.gun ? params.gun : moment().format('DD.MM.YYYY');
    let start = params.daysAgo ? moment().subtract(parseInt(params.daysAgo), "d").format('DD.MM.YYYY') : (params.start ? moment().format(params.start) : null);
    let end = params.end ? moment().format(params.end) : null;
    let il = params.il;
    let { data } = JSON.parse(await getSourceFromExternal({ gun, start, end, il }));

    if (!data.length || data.length < 1) {
      res.json({
        code: 500,
        message: `${start || gun} tarihinde bayi kaydı yok`
      });
    }

    let sehirler = (data as IBayiTapdk[]).map((bayi: any) => bayi.IlAdi);
    // @ts-ignore
    let distler = _.uniqBy(await getDistIdsByAdres([...new Set(sehirler)]), 'distId') as IDistributorShort[];

    let _bayiler = data.map((bayi: IBayiTapdk) => {
      let _bayi: IBayi = {
        il: bayi.IlAdi,
        ilRefId: bayi.IlRefId,
        ilce: bayi.IlceAdi,
        ilceRefId: bayi.IlceRefId,
        ruhsatNo: bayi.DegreeSicilNo,
        adiSoyadi: bayi.AdSoyad,
        adi: bayi.Ad,
        soyadi: bayi.Soyad,
        unvan: bayi.Unvan,
        sinif: bayi.SaticiSinifiAdi,
        adres: bayi.IkametAdres,
        durum: bayi.FiiliDurumu,
        vergiNo: bayi.VergiNo
      };

      let distIds = distler
        .filter((dist) => dist.districtCode == bayi.IlceRefId)
        .map((d: any) => new Types.ObjectId(d.distId));

      if (Array.isArray(distIds) && distIds.length > 0) {
        _bayi.distributor = distIds;
      }
      return _bayi;
    });

    // let result = await updateBayiler(_bayiler)
    // console.log(gun, result);
    res.json(_bayiler);

    // let _task = await findTaskById(taskId)
    //   .then(_task => {
    //     return taskBlock(_task);
    //   })
    //   .catch(() => {
    //     throw new Error(`Task bloke edilemedi ${_task.active}`)
    //   })
    // let result = await updateBayiler(bayiler)
    //   .then((_result) => {
    //     taskDone(_task)
    //     return _result
    //   })
    //   .catch(() => {
    //     taskError(_task)
    //     throw new Error(`Task bloke edilemedi ${_task.active}`)
    //   })
  } catch (err) {
    next(err);
  }
};

const getSourceAll = async (req: Request, res: Response, next: NextFunction) => {
  let { il } = req.body;
  let { data } = JSON.parse(await getSourceFromExternal({ il }));

  if (!data.length || data.length < 1) {
    res.json({
      code: 500,
      message: `Belirtilen kriterlerde bayi kaydı yok`
    });
  }

  let sehirler = (data as IBayiTapdk[]).map((bayi: any) => bayi.IlAdi);
  // @ts-ignore
  let distler = _.uniqBy(await getDistIdsByAdres([...new Set(sehirler)]), 'distId') as IDistributorShort[];

  let _bayiler = data.map((bayi: IBayiTapdk) => {
    let _bayi: IBayi = {
      il: bayi.IlAdi,
      ilRefId: bayi.IlRefId,
      ilce: bayi.IlceAdi,
      ilceRefId: bayi.IlceRefId,
      ruhsatNo: bayi.DegreeSicilNo,
      adiSoyadi: bayi.AdSoyad,
      adi: bayi.Ad,
      soyadi: bayi.Soyad,
      unvan: bayi.Unvan,
      sinif: bayi.SaticiSinifiAdi,
      adres: bayi.IkametAdres,
      durum: bayi.FiiliDurumu,
      vergiNo: bayi.VergiNo
    };

    let distIds = distler
      .filter((dist) => dist.districtCode == bayi.IlceRefId)
      .map((d: any) => new Types.ObjectId(d.distId));

    if (Array.isArray(distIds) && distIds.length > 0) {
      _bayi.distributor = distIds;
    }
    return _bayi;
  });

  console.log(distler)

  res.json({count : _bayiler.length, _bayiler})

};

export { getSource, getSourceAll }