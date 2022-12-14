const express = require('express');
const router = express.Router();
var passport = require('passport');
const ahora = require('../lib/ahora');
const { route } = require('.');
const db = require('../baseDeDatos');
const { logueado } = require('../lib/autenticar');

router.get('/', logueado, async (req, res) => {
  const registro = {
    username: req.user.username,
    edificio: req.user.edificio,
    fecha: ahora.fechaActual(),
    hora: ahora.horaActual(),
    actividad: 'Logout'
  }
  await db.query('INSERT INTO historiallogueo SET ?', [registro]);
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

module.exports = router