const db = require('../baseDeDatos');

async function alertaMensajes(req,res,next) {
    const consulta = await db.query('SELECT * FROM mensajes WHERE destinatario = ? AND estado = ?',[req.user.username, 'No Leído']);

    if(consulta.length > 0 ) {
        req.flash('mensaje', 'Tiene mensajes sin leer');
        return;
    }

}
module.exports = alertaMensajes
    