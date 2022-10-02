var LocalStrategy = require('passport-local').Strategy;
var cifrado = require('./cifrado');
var db = require('../baseDeDatos');
const ahora = require('../lib/ahora');
const passport = require('passport');

passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const resLogin = await db.query('SELECT * FROM usuarios WHERE username = ?', [req.body.username]);
    if (resLogin.length > 0) {
        if (await cifrado.decifrar(req.body.password, resLogin[0].password)) {
            if (resLogin[0].estado == 'Habilitado') {
                //Registro novedad en el historial de logueo
                const registro = {
                    username: resLogin[0].username,
                    edificio: resLogin[0].edificio,
                    fecha: ahora.ahora(),
                    hora: new Date().toLocaleTimeString(),
                    actividad: 'Login'
                }
                await db.query('INSERT INTO historiallogueo SET ?',[registro]);
                return done(null, resLogin[0], req.flash('mensaje', 'Bienvenido ' + resLogin[0].username));
            }
            else return done(null,false,req.flash('error', 'Usuario deshabilitado'));
        }
        else {
            return done(null, false, req.flash('error', 'Usuario o password errónea'));
        }
    } else {
        return done(null, false, req.flash('error', 'Usuario o contraseña errónea'));
    }
}));


passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {

    const nuevoUsuario = {
        id: parseInt(req.body.DNIUsuario),
        apellido: req.body.apellidoUsuario,
        nombres: req.body.nombreUsuario,
        acceso: 1,
        username: username,
        password: await cifrado.cifrar(req.body.password),
        estado: 'Habilitado'
    }

    //Valido datos del formulario

    if (req.body.nombreUsuario == '') return done(null, false, req.flash('error', 'Debe ingresar el nombre del usuario'));

    if (req.body.apellidoUsuario == '') return done(null, false, req.flash('error', 'Debe ingresar el apellido del usuario'));

    if (parseInt(req.body.DNIUsuario) < 1000000) return done(null, false, req.flash('error', 'Debe ingresarr un DNI válido'));

    let resultadoDNI = await db.query('SELECT * FROM usuarios WHERE id = ?', [parseInt(req.body.DNIUsuario)]);
    if (resultadoDNI.length > 0) return done(null, false, req.flash('error', 'El DNI del usuario ya existe'));

    if (username == '') return done(null, false, req.flash('error', 'Debe ingresar un nombre de usuario válido'));

    let resultadoUsername = await db.query('SELECT * FROM usuarios WHERE username = ?', [req.body.username]);
    if (resultadoUsername.length > 0) return done(null, false, req.flash('error', 'El nombre de usuario ya existe'));

    if (password.length < 6) return done(null, false, req.flash('error', 'Debe ingresar una clave de al menos seis caracteres'));

    if (password != req.body.password2) return done(null, false, req.flash('error', 'Las claves ingresadas no coinciden'));

    let resultado = await db.query('INSERT INTO usuarios SET ?', [nuevoUsuario]);

    if (!resultado) return done(null, false, req.flash('error', 'Error al intentar agregar el usuario'));
    else return done(null, nuevoUsuario);


}));

passport.serializeUser((usuario, done) => {
    console.log('Serealizando usuario');
    done(null, usuario);
});

passport.deserializeUser(async (usuario, done) => {
    console.log('deserealizando usuario');
    const rows = await db.query('SELECT * FROM usuarios WHERE username = ?', [usuario.username]);
    if (rows.length == 0) done(null, false);
    else done(null, rows[0]);
});