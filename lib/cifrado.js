var bcrypt = require('bcryptjs');

async function cifrar(texto) {
const salt = await bcrypt.genSaltSync(15);
const hash = await bcrypt.hashSync(texto, salt,);
return hash;
}

async function decifrar(texto,hash) {
    return bcrypt.compareSync(texto, hash);
}

exports.cifrar = cifrar;
exports.decifrar = decifrar;