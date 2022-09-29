const mysql = require('mysql');
const {database} = require('./claves');
const { promisify} = require("util");

const pool = mysql.createPool(process.env.JAWSDB_URL || database);

pool.getConnection((err,connection) => {
    if (err){
        if(err.code === "PROTOCOL_CONNECTION_LOST") {
            console.error("Conexion de datos perdida");
        }
        if (err.code === "ER_CON_COUNT_ERROR") {
            console.error("Demasiadas conexiones");
        }
        if (err.code === "ERRCONREFUSED"){
            console.error("La conexión fue rechazada");
        }
        if (err.code === "ER_DUP_ENTRY") {
            console.error("clave primaria duplicada");
        }

    }
    if (connection) connection.release();
    console.log("Conexión a base de datos exitosa");
    return;
});

pool.query = promisify(pool.query);

module.exports = pool;