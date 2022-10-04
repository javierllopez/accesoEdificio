const express = require('express');
const router = express.Router();
const alertaMensajes = require('../lib/alertaMensajes');

router.get('/', async (req, res, next) => {
    if (req.user == (undefined || null)) {
        return res.render('index', { sinUsuario: true });
    }
    else {
        await alertaMensajes(req, res, next);
        if (req.user.acceso == 1) {
            return res.render('index', { usuarioAcceso1: true, usuarioLogueado: req.user.username });
        }
        if (req.user.acceso == 2) {
           return res.render('index', { usuarioAcceso2: true, usuarioLogueado: req.user.username });
        }

    }
});

module.exports = router
