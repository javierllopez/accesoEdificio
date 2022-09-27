const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    if (req.user == (undefined || null))
    {
        res.render('index',{sinUsuario: true});
    }
    else 
    {
        if (req.user.acceso == 1)
        {
            res.render('index',{usuarioAcceso1: true, usuarioLogueado: req.user.username});
        }
        if (req.user.acceso == 2)
        {
            res.render('index',{usuarioAcceso2: true, usuarioLogueado: req.user.username});
        }

    }
});

module.exports = router
