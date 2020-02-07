//Port
process.env.PORT = process.env.PORT || 3000;

//Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//Vencimiento del Token
process.env.EXPIRE_TOKEN = 60 * 60 * 24 * 30;

//SEED jwt
process.env.SEED = process.env.SEED || 'seedDEVELOPMENT';

//BD
let connectionString;

if (process.env.NODE_ENV === 'dev') {
    connectionString = 'mongodb://localhost:27017/cafe';
} else {
    connectionString = process.env.MONGO_URI;
}

process.env.ConnectionString = connectionString;

//Google client id
process.env.CLIENT_ID = process.env.CLIENT_ID || '495541798646-1csjr5vbreps2t7o2pjnneaaf9csda5q.apps.googleusercontent.com';