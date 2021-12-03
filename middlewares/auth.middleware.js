var db = require("../_db");

module.exports.requireAuth= function(req, res, next){
    if(!req.signedCookies.userId){
        res.redirect("/auth/login");
        return;
    }

    var user = db.get("Users").find({id: req.signedCookies.userId}).value();

    if(!user){
        res.redirect("/auth/login");
        return;
    }

    res.locals.user = user;

    next();
};