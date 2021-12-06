var db = require("../_db");
var md5 = require('md5');
var shortid=require('shortid');

module.exports.index = function(req, res){
    //res.send('Welcome to members area');
    
    // res.render('users/index',{
    //     users: users
    // });

    res.render('users/index',{
        users: db.get("Users").value()
    });
};

module.exports.postCreate = function(req, res){
   
    req.body.id=shortid.generate();
    req.body.password = md5(req.body.password);
    //users.push(req.body);
    db.get("Users").push(req.body).write();

    res.redirect('/users');

    // console.log(req.body);
};