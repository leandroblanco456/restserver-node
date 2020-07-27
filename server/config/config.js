


//=====
//Puerto
//====

process.env.PORT = process.env.PORT || 3000 ;


//=====
//Vencimiento del token
//====
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias
process.env.CADUCIDAD_TOKEN = '48h';

//=====
//Seed de autenticacion
//====
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';




//=====
//Entorno
// Averigua si esta en produccion, o desarrollo.
//====

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';





//=====
//Base de datos
// Se conecta a la base de datos local o a heroku
//====

let urlDB;

if (process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = process.env.MONGO_URI
}

process.env.URLDB = urlDB;


//=============
// ---Google Client ID
//==========

process.env.CLIENT_ID = process.env.CLIENT_ID || '308123120055-c4n65966egvv5gnmr6gse1oiq7v4e2ia.apps.googleusercontent.com';