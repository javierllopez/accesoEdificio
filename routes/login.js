const express = require('express');
const router = express.Router();
const passport = require('passport');
const {noLogueado} = require('../lib/autenticar');

router.get('/',noLogueado,(req,res,next)=> {
    res.render('login');
})

router.post('/',noLogueado,passport.authenticate('local.signin',{
    successRedirect: "/",
    failureRedirect:"/login",
    failureFlash: true
}))

module.exports = router