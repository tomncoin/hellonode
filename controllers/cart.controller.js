
var db = require("../_db");

module.exports.addToCart = function(req, res, next){
    var productId = req.params.productId;
    var sessionId = req.signedCookies.sessionId;

    if(!sessionId){
        res.redirect('/products');
        return;
    }

    var count =db.get('Sessions')
    .find({id: sessionId})
    .get('cart.'+productId, 0)
    .value();

    db.get('Sessions')
    .find({id: sessionId})
    .set('cart.'+productId, count+1)
    .write();

    res.redirect('/products');
};

module.exports.index = function(req, res){
    var sessionId = req.signedCookies.sessionId;
    
    var page =  parseInt(req.query.page) || 1;
    var perPage = 100;
    var start = (page-1)*perPage;
    var end = page*perPage;

    var products =db.get('Sessions')
    .find({id: sessionId})
    .value().cart;

    res.render('cart/index',{
        products: products
    });
};