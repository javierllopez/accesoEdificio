const express = require('express')
const morgan = require('morgan');
const { json } = require('body-parser');
const path = require('path');
const exphbs = require('express-handlebars');
const flash = require("connect-flash");
const session = require("express-session");
const MySQLStore = require("express-mysql-session");
const passport = require("passport");
const {database} = require('./claves');
const {databaseHeroku} = require('./clavesHeroku');
const ahora = require('./lib/ahora');


const app = express()

if (process.env.PORT) {
    const {database} = require('./clavesHeroku');    
}else {
    const {database} = require('./claves');    
}


//Configuraciones
const port = process.env.PORT||3000;
app.set('port',process.env.PORT||3000);
app.set('views',path.join(__dirname,"views"));
app.engine('.hbs',exphbs.engine(
    {
    defaultLayout:"layout",
    layoutDir: path.join(app.get("views"),"layouts"),
    partialsDir: path.join(app.get('views'),"partials"),
    //helpers: require('./lib/handlebars'),
    extname:".hbs"
}));
app.set('view engine','.hbs');

//Middleware
app.use(session({
    secret: "siekdkdpweo499585sddepwdlfkfk12l94fj",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: (1000*60*60) },
    store: new MySQLStore(databaseHeroku)

}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(json());
app.use(passport.initialize());
app.use(passport.session());

//Variables globales
app.use((req,res,next) => {
    app.locals.mensaje = req.flash("mensaje");
    app.locals.error = req.flash("error");
    next();
});

//Routes
app.use('/',require('./routes'));
app.use('/crearCuenta',require('./routes/crearCuenta'));
app.use('/login',require('./routes/login'));
app.use('/salir',require('./routes/salir'));
app.use('/edificios',require('./routes/edificios'));
app.use('/agregarEdificio',require('./routes/agregarEdificio'));
app.use('/editarEdificio',require('./routes/editarEdificio'));
app.use('/usuarios',require('./routes/usuarios'));
app.use('/agregarUsuario',require('./routes/agregarUsuario'));
app.use('/habilitarUsuario',require('./routes/habilitarUsuario'));
app.use('/deshabilitarUsuario',require('./routes/deshabilitarUsuario'));
app.use('/editarUsuario',require('./routes/editarUsuario'));
app.use('/ingreso',require('./routes/ingreso'));
app.use('/salida',require('./routes/salida'));
app.use('/consultaMovimientos',require('./routes/consultaMovimientos'));
app.use('/personasEnEdificio',require('./routes/personasEnEdificio'));
app.use('/historialDeLogueo', require('./routes/historialDeLogueo'));
app.use('/enviarMensaje',require('./routes/enviarMensaje'));
app.use('/consultarMensajesEnviados',require('./routes/consultarMensajesEnviados'));
app.use('/consultarMensajesRecibidos',require('./routes/consultarMensajesRecibidos'));
app.use('/leerMensajeRecibido',require('./routes/leerMensajeRecibido'));
app.use('/leerMensajeEnviado',require('./routes/leerMensajeEnviado'));


app.listen(port, () => {
  console.log(`Aplicación corriendo en el puerto: ${port}`)
})