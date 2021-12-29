export {};
const path = require('path');

// import .env variables
require('dotenv-safe').load({
  path: path.join(__dirname, '../../.env')
});

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT || 7000,
  mongo: {
    uri: process.env.MONGO_URL
  },
  logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
  SENDGRID_API_KEY : process.env.SENDGRID_API_KEY,
  sender_address : {
    email : "tapdk@asstan.net",
    name : "Asstan"
  },

  CUSTOM_PRE_MAIL_SUBJECT : "TAPDK Yeni Bayiler",
  // DEFAULT values and limiters
  LIMIT_MAX : 101,
  LIMIT_MIN : 9,
  LIMIT_DEFAULT : 500,
  FILE_UPLOAD_DIR : path.join(__dirname, '../../incoming_files'),

  TAPDK_URL : "http://212.174.130.210/NewTapdk/ViewApp/sorgu.aspx",

  SESSION_SECRET : process.env.SESSION_SECRET,
  JWT_SECRET : process.env.JWT_SECRET
};
