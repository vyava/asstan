import { NextFunction, Request, Response } from 'express';
import { getBayilerByGroup } from '../controllers/bayi.controller';
import { createExcelFile } from '../helper/excel';
// import { IBayi } from '../../api/interface';

const APIError = require('../utils/APIError');
// import * as httpStatus from 'http-status';
import * as path from 'path';

const config = require('../../config/vars');

import * as MailService from '@sendgrid/mail';
// const sg = require("sendgrid")(process.env.SENDGRID_API_KEY);
import * as sg from 'sendgrid';
import { setSubstitutionWrappers } from '@sendgrid/mail';
import { classes } from '@sendgrid/helpers';

import * as _ from 'lodash';

import * as fs from 'fs';
import moment = require('moment');
import { IBolgeMailData } from '../../api/interface/mail.interface';
import { MailData } from '@sendgrid/helpers/classes/mail';
// import { getTemplate } from './template.controller';
// import { memorySizeOf } from '../helper/byte';
import { ExcelSetup } from '../../config/file.vars';

export async function sendOne(email, message){
  if(!email) return false;

  MailService.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    from : config.sender_address,
    to : email,
    html : `<div>${message}</div>`,
    subject: 'Hello world'
  };

  return new Promise((resolve, reject) => {
    MailService.send(msg, false, (error, result) => {

      if(error) return reject(error);

      resolve(result)
    });
  })


}

export async function send(req: Request, res: Response, next: NextFunction) {
  try {
    initialize();
    // Get date from request query. if null, Joi will set `DÜN` as default
    const { gun, kod } = <any>req.query;

    // Get bayiler from DB by date
    let data: IBolgeMailData[] = await getBayilerByGroup(gun, kod);

    // res.send(data)

    // If bolge length less than 1 throw error
    if (data.length < 1)
      throw new APIError({
        message: 'Mail gönderimi yapılacak bayi bulunamadı.'
      });

    let resultPromises = data.map(async (dist, i) => {
      let filePath = await createExcelFile(ExcelSetup, dist.bayiler);

      // console.log(dist.users);
      let mailPayload: MailData | any = {
        attachments: {
          content: fs.readFileSync(filePath, { encoding: 'base64' }),
          filename: 'TAPDK Yeni Bayiler' + '.xlsx'
        },

        to: _.compact(dist.users),
        // to : [
        //   {
        //     name : "zafer",
        //     email : "zafergenc@gmail.com"
        //   }
        // ],
        // cc: _.compact(cc),
        distName: dist.distName,
        // to: {
        //   name: 'Zafer GENÇ',
        //   email: 'zafergenc02@gmail.com'
        // }

        // html : await getTemplate('YENI_BAYI', dist.bayiler)
      };
      return mailPayload;
    });

    let payloadResult = await executeAllPromises(resultPromises);

    let mailResult = await sendMail(payloadResult.results, {
      fileName: 'TAPDK Yeni Bayiler'
    });
    console.log(mailResult)
    res.json(mailResult);
  } catch (err) {
    next(err);
  }
}

function executeAllPromises(promises) {
  // Wrap all Promises in a Promise that will always "resolve"
  var resolvingPromises = promises.map(function (promise) {
    return new Promise(function (resolve) {
      var payload = new Array(2);
      promise
        .then(function (result) {
          payload[0] = result;
        })
        .catch(function (error) {
          payload[1] = error;
        })
        .then(function () {
          /*
           * The wrapped Promise returns an array:
           * The first position in the array holds the result (if any)
           * The second position in the array holds the error (if any)
           */
          resolve(payload);
        });
    });
  });

  var errors = [];
  var results = [];

  // Execute all wrapped Promises
  return Promise.all(resolvingPromises).then(function (items) {
    items.forEach(function (payload) {
      if (payload[1]) {
        errors.push(payload[1]);
      } else {
        results.push(payload[0]);
      }
    });

    return {
      errors: errors,
      results: results
    };
  });
}

async function sendMail(payload: any, options?: any) {
  let mailer = sg(process.env.SENDGRID_API_KEY);

  let mailPromises: any = payload.map((_m: any, i) => {
    return new Promise((resolve, reject) => {
      // if(i>0) reject(false);
      let mail = new classes.Mail();

      mail.setFrom(config.sender_address);

      mail.setSubject('TAPDK Yeni Bayiler');

      mail.setTemplateId('d-413e63c686384b03ba4d3cef6ae01582');

      var personalization = new classes.Personalization();

      setSubstitutionWrappers('{{', '}}');
      let attachment = <any>new classes.Attachment();
      attachment.setContent(_m.attachments.content);
      attachment.setFilename(`${_m.distName} - ${options.fileName}.xlsx`);

      mail.addAttachment(attachment);

      _m.to.map((_to, i) => {
        // if (i < 1) {
          personalization.addTo({
            name: _to.name,
            email: _to.address

            // name: 'Zafer',
            // email: 'zafergenc02@gmail.com'
          });
        // }
      });

      personalization.addBcc({
        name: 'Zafer Genç',
        email: 'genczafer02@gmail.com'
      });

      personalization.setDynamicTemplateData({
        prefix_mail_subject: config.CUSTOM_PRE_MAIL_SUBJECT,
        mail_date: moment().format('DD-MM-YYYY'),
        distName: _m.distName
      });

      mail.addPersonalization(<any>personalization);
      // mail.addHtmlContent(_m.html)

      let mailRequest = mailer.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON()
      });

      return mailer.API(mailRequest, function (err, response) {
        if (err){
          fs.writeFileSync(path.join(__dirname, "../../../files", "error.json"), JSON.stringify(response));
          reject(err)
        };
        console.log({
          dist: _m.distName,
          statusCode : response.statusCode, 
        });
        resolve({
          dist : _m.distName,
          statusCode: response.statusCode,
          body: response.body,
          header: response.headers
        });
      });
    });
  });
  // console.log(await mailPromises);
  return await Promise.all(mailPromises);

  // return await Promise.all(mailPromises).then((mailRequest : any) => {
  //   return mailer.API(mailRequest, function (err, response) {
  //     if (err) return err;
  //     console.log(err);
  //     return {
  //       statusCode: response.statusCode,
  //       body: response.body,
  //       header: response.headers
  //     };
  //   });
  // });

  // return await mailPromises;

  // return await new Promise((resolve, reject) => {
  //   mailer.API(request, function (err, response) {
  //     if (err) reject(err);
  //     console.log(err);
  //     resolve({
  //       statusCode: response.statusCode,
  //       body: response.body,
  //       header: response.headers
  //     });
  //   });
  // });
}

function initialize() {
  MailService.setApiKey(process.env.SENDGRID_API_KEY);
}
