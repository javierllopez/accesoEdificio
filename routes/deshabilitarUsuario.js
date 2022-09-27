const express = require('express');
const router = express.Router();
const passport = require('passport');
const db = require('../baseDeDatos');
const {accesoNivel1} = require('../lib/autenticar');

router.get('/:idUsuario', accesoNivel1,async (req,res,next)=> {
    const id = req.params;
    console.log(id);
    const miUsuario = {
        estado: 'Deshabilitado'
    }

    const habilitarUsuario = await db.query('UPDATE usuarios SET ? WHERE username = ?',[miUsuario,id.idUsuario]);
    return res.redirect('/usuarios');
 
});

module.exports = router