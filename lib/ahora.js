module.exports = {
    convertir(fecha) {
        return fecha.getFullYear().toString()+'/'+(fecha.getMonth()+1).toString()+'/'+fecha.getDate().toString();
        
    },
    ahora(){
        miFecha = new Date();
        return miFecha.getFullYear().toString()+'/'+(miFecha.getMonth()+1).toString()+'/'+miFecha.getDate().toString();
    },
    convertirAFechaNormal(fecha) {
        return fecha.getDate().toString()+'/'+(fecha.getMonth()+1).toString()+'/'+fecha.getFullYear().toString();
    }
    
}