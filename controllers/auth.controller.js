var db = require("../_db");
var md5 = require('md5');

module.exports.login = function(req, res){
    res.render('auth/login');
};


module.exports.postLogin = function(req, res){
    var email = req.body.email;
    var password = req.body.password;
    var hashPassword = md5(password);

    var errors = [];
    if(!email){
        errors.push("Email is required.");
    }
    if(!password){
        errors.push("Password is required.");
    }

    if(errors.length){
        res.render("auth/login",{
            errors: errors,
            values: req.body
        });
        return;
    }
   
    var user = db.get("Users").find({email: email}).value();

    if(!user){
        errors.push("Invalid email.");
    }
    else if(user.password !== hashPassword){
        errors.push("Wrong password.");
    }

    if(errors.length){
        res.render("auth/login",{
            errors: errors,
            values: req.body
        });
        return;
    }

    res.cookie("userId", user.id,{
        signed: true,
        maxAge: 60
    });
    res.redirect('/');
};