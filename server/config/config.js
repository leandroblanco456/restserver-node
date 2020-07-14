


//=====
//Puerto
//====

process.env.PORT = process.env.PORT || 3000 ;





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
    urlDB = 'mongodb+srv://lean456:BUfJX7zBVMAZ53zH@cluster0.lg4mc.mongodb.net/cafe'
}

process.env.URLDB = urlDB;

