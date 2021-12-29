// import * as tempfile from 'tempfile';
import * as Excel from 'exceljs';
const APIError = require('../utils/APIError');
import * as httpStatus from 'http-status';
import * as moment from 'moment';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const BASE_DIR = 'files';
const DEFAULT_SHEETNAME = 'Sayfa 1';

export function newWorkbook(options?: any) {
  try {
    let _wb = new Excel.Workbook();
    // _wb.creator = "net.asstan";
    return _wb;
  } catch (err) {
    throw new APIError({
      message: 'Workbook oluşturulamadı.',
      status: httpStatus.NO_CONTENT
    });
  }
}

function getFilePath() {
  if (!fs.existsSync(BASE_DIR)) {
    fs.mkdirSync(BASE_DIR);
  }

  return BASE_DIR;
}


export function addValuesToWorksheet(workbook: Excel.Workbook, columns: string[], values: any[], options?: any) {
  return new Promise((resolve, reject) => {
    let _ws = workbook.getWorksheet(DEFAULT_SHEETNAME);
    let _columns = <Excel.Column[]>Object.keys(columns).map((key) => ({
      header: columns[key].headerName,
      key,
      width: columns[key].columnWidth
    }));

    // _ws.addTable({
    //     name : "d" + "test",
    //     ref : "A1",
    //     headerRow : true,
    //     rows : values,
    //     columns : Object.keys(_columns).map((col : any) => col.header)
    // })

    _ws.columns = _columns;

    _ws.getRow(1).font = {
      bold: true,
      size: 13
    };

    values.map((bayi : any) => {
      bayi.konum = {
        text : "GİT",
        hyperlink : `https://www.google.com/maps/search/?api=1&query=${bayi.adres}`,
        font : {
          bold : true,
          color : {
            argb : "#6E14C7"
          }
        }
      }
      return bayi;
    });

    _ws.getRow(1).eachCell((cell) => {
      cell.border = {
        bottom: {
          color: {
            argb: '#000000'
          },
          style: 'thick'
        }
      };
    });

    // let istenmeyen = ['ruhsatTipleri', 'createdAt', 'updatedAt', 'sinifDsd'];
    // let _bayiler = values.map((bayi) => istenmeyen.map((k) => delete bayi[k]));

    _ws.insertRows(2, [...values]);
    resolve(true);
  });
}

export async function createExcelFile(header, bayiler) {
  let workbook = newWorkbook();

  workbook.addWorksheet(DEFAULT_SHEETNAME, {
    views: [
      {
        zoomScale: 110,
        // state: 'frozen',
        ySplit: 1
      }
    ]
  });

  addValuesToWorksheet(workbook, header, bayiler);

  return await saveFile(workbook);
}

export function saveFile(_wb: Excel.Workbook) {
  // Set default options to write
  let tempPath = getFilePath();
  let fileName = moment().format('DD-MM-YYYY') + '-' + uuidv4();
  let fileExt = 'xlsx';

  let path = `${tempPath}/${fileName}.${fileExt}`;

  return _wb.xlsx
    .writeFile(path)
    .then((resolve) => {
      return path;
    })
    .catch((err) => {
      throw new Error('Dosya yazılamadı.');
    });
}
