import * as moment from 'moment';
import { TARIH } from './interface/request';
process.env.TZ = 'Europe/Istanbul';

enum GÜN {
  dun = -1,
  bugun = 0,
  hafta = -7,
  yarimay = -15,
  tamay = -30
}

export function getDate(gun: any = 'bugun', type: string = 'tapdk'): any {
  if (type == 'tapdk') {
    return GÜN[gun];
  }

  // let start : any, end : any;
  let { start, end } = { start: null, end: null };

  if (typeof TARIH[gun] == 'string') {
    start = moment()
      .startOf(<any>TARIH[gun])
      .toDate();
    end = moment()
      .endOf(<any>TARIH[gun])
      .toDate();
  } else if (typeof TARIH[gun] == 'number') {
    start = moment().subtract(TARIH[gun], 'days').startOf('day').toDate();
    end = moment().subtract(TARIH[gun], 'days').endOf('day').toDate();
  } else {
    throw new Error('Tarih aralığı istenen formatta değil.');
  }
  return { start, end };
}

// export function getDateTS(gun : any = "BUGÜN"){
//     var date = moment().tz("Europe/Istanbul").subtract(<any>GÜN[gun], "days").hour(7).valueOf();
//     return date;
// }
