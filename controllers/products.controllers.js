var db = require("../_db");

var shortid=require('shortid');

module.exports.index = function(req, res){
    var page =  parseInt(req.query.page) || 1;
    var perPage = 8;
    var start = (page-1)*perPage;
    var end = page*perPage;

    res.render('products/index',{
        // products: db.get("Products").value().slice(start, end)
        products: db.get("Products").drop(start).take(perPage).value()
    });
};

module.exports.postCreate = function(req, res){
    req.body.code=shortid.generate();

    console.log(res.locals);

    db.get("Products").push(req.body).write();

    res.redirect('/products');

    console.log(req.body);
};