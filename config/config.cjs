require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

   module.exports = {
     development: {
       url: process.env.DATABASE_URL,
       dialect: 'postgres',
     },
     test: {
       url: process.env.DATABASE_URL ? process.env.DATABASE_URL.replace('taskapi', 'taskapi_test') : '',
       dialect: 'postgres',
     },
     production: {
       url: process.env.DATABASE_URL,
       dialect: 'postgres',
     },
   };