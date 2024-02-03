var app  = require('express')();
var http = require('http').Server(app);
var io   = require('socket.io')(http);

//DataBase 
const fs = require('fs');
const Archivo = "db.json";
const Mensajes = "mensajes.json";

const cors = require('cors'); 
app.use(cors()); 

let LeerDatos = function (name) {
  let rawdata = fs.readFileSync(name);
  let Datos = JSON.parse(rawdata);

  return Datos;
};

let Fecha = new Date();
Fecha = Fecha.getTime() + (-Fecha.getTimezoneOffset() * 60 * 1000);
Fecha = new Date(Fecha);
Fecha = Fecha.toISOString().substring(0, 19).replace("T", " ");

//Comprobamos si existe el archivo

 if (fs.existsSync(Archivo) === false) {
  //Si no existe lo creamos
  fs.writeFileSync(Archivo, 
               '[ "' + Fecha + '" ]');
  console.log("Primera ejecución:");
  console.log(LeerDatos(Archivo));
} else {
  //Si existe lo leemos y añadimos la fecha actual
  let Datos = LeerDatos(Archivo);
  Datos.unshift(Fecha);
  fs.writeFileSync(Archivo, 
                 JSON.stringify(Datos));
  console.log("El programa se ha ejecutado " + Datos.length + " veces");
  console.log(Datos);
};

//MensajesDataBase

if (fs.existsSync(Mensajes) === false) {
  //Si no existe lo creamos

  fs.writeFileSync(Mensajes, 
               '[' + ']');
  console.log("DataBase Lista:");
} 

function putData(sms) {
  fs.readFile('mensajes.txt', 'utf-8', (err, data) => {
  if(err) {
    console.log('error: ', err);
  } else {
dat=data; 
fs.writeFileSync(Mensajes, 
                data + "/n" + sms);

    console.log(data);
  }
});
};
function nuevoMensaje(sms) { 
putData(sms); 
  console.log(sms);
};

function nuevoMensaje1 (sms) { 
let Datos = LeerDatos(Mensajes);
  Datos.push(sms);
  fs.writeFileSync(Mensajes, 
                 JSON.stringify(Datos));
  
  console.log(sms);
};

let getMessage = function () {
  let rawdata = fs.readFileSync(Mensajes);
  let Datos = JSON.parse(rawdata);

  return Datos;
};


//cerrramos database 

/*
 *  Configuramos nuestra ruta (index) principal con
 *  express para mostrar el chat
 */
app.get('/', function(req, res) {
  res.sendFile( __dirname + '/index.html');
});
 
 
/*
 *  Configuramos Socket.IO para estar a la escucha de
 *  nuevas conexiones.
 */
io.on('connection', function(socket) {
   
  console.log('New user connected');
io.emit('db', LeerDatos(Mensajes));


  /*
   * Cada nueva conexión deberá estar a la escucha
   * del evento 'nuevo mensaje', el cual se activa
   * cada vez que un usuario envia un mensaje.
   * 
   * @param  msj : Los datos enviados desde el cliente a 
   *               través del socket.
   */
  socket.on('nuevo mensaje', function(msj) {
    io.emit('nuevo mensaje', msj);
  });

//database 

//guardamos mensaje en database 
socket.on('nuevo mensaje', function(msj) {
    nuevoMensaje1(msj); 
  });

   
  /*
   * Imprimimos en consola cada vez que un usuario
   * se desconecte del sistema.
   */
  socket.on('disconnect', function() {
    console.log('Usuario desconectado');
  });
   
});

 
/*
 * Iniciamos la aplicación en el puerto 3000
 */
http.listen(3000, function() {
  console.log('listening on *:3000');
});

