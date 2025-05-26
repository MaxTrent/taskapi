require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

   module.exports = {
     development: {
       url: process.env.DATABASE_URL,
       dialect: 'postgres',
       logging: false
     },
     production: {
      url: process.env.DATABASE_URL,
      dialect: 'postgres',
      // dialectOptions: {
      //   ssl: {
      //     require: false,
      //     rejectUnauthorized: false,
      //   },
      // },
      logging: false
    },
   };