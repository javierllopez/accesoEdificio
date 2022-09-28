module.exports = {
    convertir(fecha) {
        return fecha.getFullYear().toString()+'/'+fecha.getMonth().toString()+'/'+fecha.getDay().toString();
        
    },
    ahora(){
        miFecha = new Date();
        return miFecha.getFullYear().toString()+'/'+miFecha.getMonth().toString()+'/'+miFecha.getDay().toString();
    }
    
}