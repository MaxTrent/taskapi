require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

   module.exports = {
     development: {
       url: process.env.DOCKER_DATABASE_URL,
       dialect: 'postgres',
       logging: false
     },
     production: {
      url: process.env.DOCKER_DATABASE_URL,
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
      logging: false
    },
   };