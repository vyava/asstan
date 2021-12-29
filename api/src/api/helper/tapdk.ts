import * as rp from "request-promise";

import * as httpStatus from 'http-status';
const APIError = require('../utils/APIError');

import * as _ from 'lodash';
import { IBayi } from '../../api/interface';
import { formHeaders } from './headers';
import { string } from 'joi';

const TAPDK_URL = 'https://tadbsatisbelgesi.tarimorman.gov.tr/KamuyaAcik/DataTablesList/';

// export const ruhsatPattern = new RegExp('^[0-9]+(PT|PI|TI|TT|P|AI|N|TE)+$', 'i');
export async function getSourceFromExternal(params: any) {
  let { gun, start, end, il } = params;

  // const formUrlEncoded = (x) => Object.keys(x).reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, '');
  try {
    return rp.post({
      uri : TAPDK_URL,
      form : formHeaders({ gun, start, end, il }),
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    })
  } catch (error) {
    return error;
  }
}