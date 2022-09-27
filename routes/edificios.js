const express = require('express');
const router = express.Router();
const passport = require('passport');
const db = require('../baseDeDatos');
const {accesoNivel1} = require('../lib/autenticar');

router.get('/', accesoNivel1,async (req,res,next)=> {
    const edificios = await db.query('SELECT * FROM edificios WHERE administrador = ?',[req.user.id]);

    res.render('Edificios',{edificios:edificios});
})


module.exports = router