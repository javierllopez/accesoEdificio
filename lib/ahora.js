module.exports = {
    convertir(fecha) {
        return fecha.getFullYear().toString()+'/'+(fecha.getMonth()+1).toString()+'/'+fecha.getDate().toString();
        
    },
    ahora(){
        miFecha = new Date();
        fechaArgentina = miFecha.getTime() - (1000*60*60*3);
        miFecha = new Date(fechaArgentina);

        return miFecha.getFullYear().toString()+'/'+(miFecha.getMonth()+1).toString()+'/'+miFecha.getDate().toString();
    
    },
    convertirAFechaNormal(fecha) {
        return fecha.getDate().toString()+'/'+(fecha.getMonth()+1).toString()+'/'+fecha.getFullYear().toString();
    },
    fechaActual() {
        miFecha = new Date();
        fechaArgentina = miFecha.getTime() - (1000*60*60*3);
        miFecha = new Date(fechaArgentina);

        return miFecha.getFullYear().toString()+'/'+(miFecha.getMonth()+1).toString()+'/'+miFecha.getDate().toString();       
    },
    horaActual() {
        miFecha = new Date();
        fechaArgentina = miFecha.getTime() - (1000*60*60*3);
        miFecha = new Date(fechaArgentina);      
        
        return miFecha.toLocaleTimeString();

    }

    
    
}