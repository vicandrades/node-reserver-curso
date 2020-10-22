//===============================================
//PUERTO
//heroku actualiza la variable del puerto si ella es null es porque esta corriendo en un ambiente local y por eso enviamos el puerto 3000
//===============================================
process.env.PORT = process.env.PORT || 3000;


//===============================================
//ENTORNO
//===============================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//===============================================
//BASE DE DATOS
//===============================================
let urlDB = process.env.MONGO_URLDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
}

//esta enviroments es creada por nosotros no es propio de node
process.env.URLDB = urlDB;