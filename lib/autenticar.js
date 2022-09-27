module.exports = {
    logueado(req,res,next){
        if (req.isAuthenticated()) return next();
        else return res.redirect('/');
    },

    noLogueado(req,res,next) {
        if(!req.isAuthenticated()) return next();
        else return res.redirect('/login');
    },

    accesoNivel1(req,res,next) {
        if (req.isAuthenticated()){
            if (req.user.acceso == 1) return next();
            else return res.redirect('/');
        } else res.redirect('/');
    },
    accesoNivel2(req,res,next) {
        if (req.isAuthenticated()){
            if (req.user.acceso == 2) return next();
            else return res.redirect('/');
        } else res.redirect('/');
    }
}