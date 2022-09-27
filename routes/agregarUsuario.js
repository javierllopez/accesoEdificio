const express = require('express');
const router = express.Router();
const passport = require('passport');
const cifrado = require('../lib/cifrado');
const db = require('../baseDeDatos');
const { accesoNivel1 } = require('../lib/autenticar');

router.get('/', accesoNivel1, async (req, res) => {

    const resultado = await db.query('SELECT id, descripcion FROM edificios WHERE administrador = ?', [req.user.id]);
    return res.render('agregarUsuario', { edificio: resultado });
    
});

router.post('/', accesoNivel1, async (req, res, next) => {

    if (isNaN(parseInt(req.body.edificioUsuario))) {
        req.flash('error', 'Debe seleccionar un edificio');
        return res.redirect('/agregarUsuario');
    };

    if (req.body.nombreUsuario == '') {
        req.flash('error', 'Debe ingresar el nombre completo del usuario');
        return res.redirect('/agregarUsuario');
    }
    if (req.body.apellidoUsuario == '') {
        req.flash('error', 'Debe ingresar el apellido del usuario');
        return res.redirect('/agregarUsuario');
    }
    if (parseInt(req.body.DNIUsuario) < 1000000) {
        req.flash('error', 'Debe ingresar un DNI válido');
        return res.redirect('/agregarUsuario');
    }
    const resDni = await db.query('SELECT * FROM usuarios WHERE id = ?', [req.body.DNIUsuario]);
    if (resDni.length > 0) {
        req.flash('error', 'El DNI del usuario ya fue cargado');
        return res.render('agregarUsuario');
    }
    if (req.body.username == '') {
        req.flash('error', 'Debe seleccionar una denominación para el usuario');
        return res.redirect('/agregarUsuario');
    }
    const rUsername = await db.query('SELECT * FROM usuarios WHERE username = ?', [req.body.username]);
    if (rUsername.length > 0) {
        req.flash('error', 'El nombre de usuario ya fue ingresado');
        return res.redirect('/agregarUsuario');
    }
    if (req.body.password.length < 6) {
        req.flash('error', 'La longitud del password no debe ser menor a 6 caracteres');
        return res.redirect('/agregarUsuario');
    }
    if (req.body.password !== req.body.password2) {
        req.flash('error', 'Las claves ingresadas no coinciden');
        return res.redirect('/agregarUsuario');
    }

    const nuevoUsuario = {
        id: parseInt(req.body.DNIUsuario),
        apellido: req.body.apellidoUsuario,
        nombres: req.body.nombreUsuario,
        username: req.body.username,
        acceso: 2,
        password: await cifrado.cifrar(req.body.password),
        estado: 'Habilitado'
    }

    const nuevoEdificioUsuario = {
        idEdificio: parseInt(req.body.edificioUsuario),
        idUsuario: req.body.username,
        idAdmin: req.user.username
    }

    await db.query('INSERT INTO usuarios SET ?', [nuevoUsuario]);

    await db.query('INSERT INTO edificiosusuarios SET ?', [nuevoEdificioUsuario]);

    req.flash('mensaje', 'Usuario agregado exitosamente');
    return res.redirect('/usuarios');

});


module.exports = router