const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../lib/passport');
const {noLogueado} = require('../lib/autenticar');

router.get('/',noLogueado,(req,res)=> {
    res.render('crearCuenta');
});

router.post('/',noLogueado,passport.authenticate('local.signup',{
    failureRedirect:'/crearCuenta',
    successRedirect:'/'
  }));

module.exports = router
