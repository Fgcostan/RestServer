// ==========
// Puerto
// ==========

process.env.PORT = process.env.PORT || 3000;



// ==========
// Entorno
// ==========

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';



// ==========
// Token
// ==========

process.env.TOKEN_EXPIRATION = 60 * 60 * 24 * 30;

if (process.env.NODE_ENV === 'dev') {
    process.env.TOKEN_SEED = 'development_seed';
} else {
    process.env.TOKEN_SEED = process.env.HEROKU_SEED;
}



// ==========
// Base de datos
// ==========

let UrlDB;

if (process.env.NODE_ENV === 'dev') {
    UrlDB = 'mongodb://localhost:27017/cafe';
} else {
    UrlDB = process.env.MONGO_URL;
}

process.env.URLDB = UrlDB;



// ==========
// Google Client ID
// ==========

process.env.CLIENT_ID = process.env.CLIENT_ID || '490314396768-52ldn8ghag9ubsagftr5384gvangp1qn.apps.googleusercontent.com';