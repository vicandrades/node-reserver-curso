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
//VENCIMIENTO DEL TOKEN
//===============================================

process.env.CADUCIDAD_TOKEN = '48h';


//===============================================
//SEED DE AUTENTICACION 
//===============================================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//===============================================
//BASE DE DATOS
//===============================================
let urlDB = process.env.MONGO_URLDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
}

//esta enviroments es creada por nosotros no es propio de node
process.env.URLDB = urlDB;


//===============================================
//GOOGLE CLIENT ID
//===============================================

process.env.CLIENT_ID = process.env.CLIENT_ID || '679579865635-g97mussmefrrm8l7mhndt51pebrpgi7n.apps.googleusercontent.com';