var express= require("express");
var router = express.Router();
var shortid=require('shortid');


var db = require("../_db");

var authMiddleware = require("../middlewares/auth.middleware");

var controller = require("../controllers/products.controllers");
var validate = require("../validate/product.validate");

router.get('/',  controller.index);

router.get("/search", function(req,res){
    var q=req.query.n;

    var matchProducts = db.get('Products').value().filter(function(product){
        return product.name.indexOf(q) !== -1;
    })

    
    res.render('products/index',{
        products:matchProducts
    });

    console.log(req.query);
});

router.get("/create",function(req, res){
    res.render("products/create");
});

router.post("/create", validate.postCreate, controller.postCreate);

router.post("/create1", function(req, res){

    req.body.code=shortid.generate();

    var errors = [];
    if(!req.body.name){
        errors.push("Name is required.");
    }
    if(errors.length){
        res.render("products/create",{
            errors: errors,
            values: req.body
        });
        return;
    }
    db.get("Products").push(req.body).write();

    res.redirect('/products');

    console.log(req.body);
});

router.get("/view/:code",function(req,res){
    var code=req.params.code;
    var product=db.get("Products").find({id:code}).value();
    res.render("products/view",{
        product:product
    });
});


module.exports = router;