
var shortid=require('shortid');
var db = require("../_db");

module.exports.create = function(req, res, next){
    res.render('transfer/create',{
        csrfToken: req.csrfToken()
    });
};

module.exports.postCreate = function(req, res, next){
    var data={
        id: shortid.generate(),
        account: req.body.account,
        amount: parseInt(req.body.amount),
        user: req.signedCookies.userId,
    }

    req.body.id = shortid.generate();
    db.get('transfer').push(data).write();
    res.redirect("/transfer/create")
};