var express= require("express");
var router = express.Router();
var shortid=require('shortid');

var multer = require('multer');

var db = require("../_db");

var controller = require("../controllers/users.controllers");
var validate = require("../validate/user.validate");

var upload = multer({dest: './public/uploads/'});

router.get('/',  controller.index);

router.get("/search", function(req,res){
    var q=req.query.n;


    //  var matchUsers = users.filter(function(user){
    //      return user.name.indexOf(q) !== -1;
    //  })
    
    var matchUsers = db.get('Users').value().filter(function(user){
        return user.name.indexOf(q) !== -1;
    })

    
    res.render('users/index',{
        users:matchUsers
    });

    console.log(req.query);
});

router.get("/create",function(req, res){
    console.log(req.cookies);
    res.render("users/create");
});

router.post("/create", upload.single('./public/avatar'), validate.postCreate, controller.postCreate);



router.get("/view/:id",function(req,res){
    var id=req.params.id;
    var user=db.get("Users").find({id:id}).value();
    res.render("users/view",{
        user:user
    });
});


module.exports = router;

// var users=[
//     {id: 1, name: 'Smith'},
//     {id:2, name: 'John'},
//     {id: 1, name: 'Victoria'},
// ];