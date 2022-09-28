const express = require('express');
const router = express.Router();
const passport = require('passport');
const cifrado = require('../lib/cifrado');
const db = require('../baseDeDatos');
const { accesoNivel1 } = require('../lib/autenticar');

router.get('/:idUsuario', accesoNivel1, async (req, res) => {

    const idUsuario = req.params;

    const resultado = await db.query('SELECT * FROM usuarios WHERE username = ?', [idUsuario.idUsuario]);
    const edificio = await db.query('SELECT * FROM edificios WHERE administrador = ?',[req.user.id]);
    const edificioUsuario = await db.query('SELECT * FROM edificiosusuarios WHERE idUsuario = ? AND idAdmin = ?',[idUsuario.idUsuario,req.user.username]);

    return res.render('editarUsuario', { usuario: resultado[0], edificio: edificio,edificioUsuario: edificioUsuario[0], helpers: {
        seleccionado: (esteUsuario, esteEdificio)=> {
            console.log(esteUsuario, esteEdificio);
            if (parseInt(esteUsuario) == parseInt(esteEdificio)) return 'selected';
        },
        aux: ()=> {
            return edificioUsuario[0].idEdificio;
        }
    }});
    
});

router.post('/:idUsuario', accesoNivel1, async (req, res, next) => {

    const idUsuario = req.params

    if (isNaN(parseInt(req.body.edificioUsuario))) {
        req.flash('error', 'Debe seleccionar un edificio');
        return res.redirect('/editarUsuario/'+idUsuario.idUsuario);
    };

    if (req.body.nombreUsuario == '') {
        req.flash('error', 'Debe ingresar el nombre completo del usuario');
        return res.redirect('/editarUsuario/'+idUsuario.idUsuario);
    }
    if (req.body.apellidoUsuario == '') {
        req.flash('error', 'Debe ingresar el apellido del usuario');
        return res.redirect('/editarUsuario/'+idUsuario.idUsuario);
    }
    if (parseInt(req.body.DNIUsuario) < 1000000) {
        req.flash('error', 'Debe ingresar un DNI válido');
        return res.redirect('/editarUsuario/'+idUsuario.idUsuario);
    }
    const resDni = await db.query('SELECT * FROM usuarios WHERE id = ? AND username != ?', [req.body.DNIUsuario,idUsuario.idUsuario]);
    if (resDni.length > 0) {
        req.flash('error', 'El DNI del usuario ya fue cargado');
        return res.render('/editarUsuario/'+idUsuario.idUsuario);
    }
    if (req.body.username == '') {
        req.flash('error', 'Debe seleccionar una denominación para el usuario');
        return res.redirect('/editarUsuario/'+idUsuario.idUsuario);
    }
    const rUsername = await db.query('SELECT * FROM usuarios WHERE username = ? AND id!= ?', [req.body.username,req.body.DNIUsuario]);
    if (rUsername.length > 0) {
        req.flash('error', 'El nombre de usuario ya fue ingresado');
        return res.redirect('/editarUsuario/'+idUsuario.idUsuario);
    }
    if (req.body.password.length < 6) {
        req.flash('error', 'La longitud del password no debe ser menor a 6 caracteres');
        return res.redirect('/editarUsuario/'+idUsuario.idUsuario);
    }
    if (req.body.password !== req.body.password2) {
        req.flash('error', 'Las claves ingresadas no coinciden');
        return res.redirect('/editarUsuario/'+idUsuario.idUsuario);
    }

    const nuevoUsuario = {
        id: parseInt(req.body.DNIUsuario),
        apellido: req.body.apellidoUsuario,
        nombres: req.body.nombreUsuario,
        username: req.body.username,
        acceso: 2,
        password: await cifrado.cifrar(req.body.password),
        estado: 'Habilitado',
        edificio: req.body.edificioUsuario
    }

    const nuevoEdificioUsuario = {
        idEdificio: parseInt(req.body.edificioUsuario),
    }

    await db.query('UPDATE usuarios SET ? WHERE username = ?', [nuevoUsuario,req.body.username]);

    await db.query('UPDATE edificiosusuarios SET ? WHERE idUsuario = ? AND idAdmin = ?', [nuevoEdificioUsuario,req.body.username,req.user.username]);

    req.flash('mensaje', 'Usuario modificado exitosamente');
    return res.redirect('/usuarios');

});


module.exports = router