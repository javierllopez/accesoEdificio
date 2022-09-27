const express = require('express');
const router = express.Router();
var passport = require('passport');
const { route } = require('.');
const {logueado} = require('../lib/autenticar');

router.get('/', (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
});

module.exports = router