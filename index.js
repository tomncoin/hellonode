require('dotenv').config();
// console.log(process.env);

var express=require('express');
var app=express();
var bodyParser=require('body-parser');
var shortid=require('shortid');
var cookieParser = require("cookie-parser");
var md5 = require('md5');

var port=5000;
app.set('view engine','pug');
app.set('views','./views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static('public'));
app.use(cookieParser(process.env.SESSION_SECRET));


//#region Users

var low=require('lowdb');
var fileSync=require('lowdb/adapters/FileSync');
var adapter=new fileSync('db.json');
var db=low(adapter);
db.defaults({Users:[]})
    .write();

var productRoute = require("./routes/product.route");
var authRoute = require("./routes/auth.route");

var authMiddleware = require("./middlewares/auth.middleware");

app.get('/', authMiddleware.requireAuth, function(req, res){
    //res.send('Welcome Node.js');
    res.render('index',{
        copy:'Kingo'
    }
    );
});

// var users=[
//     {id: 1, name: 'Smith'},
//     {id:2, name: 'John'},
//     {id: 1, name: 'Victoria'},
// ];

app.get('/users',function(req, res){
    //res.send('Welcome to members area');
    
    // res.render('users/index',{
    //     users: users
    // });

    res.render('users/index',{
        users: db.get("Users").value()
    });
});

app.get("/users/search",function(req,res){
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

app.get("/users/create",function(req, res){
    console.log(req.cookies);
    res.render("users/create");
});

app.post("/users/create", function(req, res){

    req.body.id=shortid.generate();
    req.body.password = md5(req.body.password);
    //users.push(req.body);
    db.get("Users").push(req.body).write();

    res.redirect('/users');

    // console.log(req.body);
});

app.get("/users/view/:id",function(req,res){
    var id=req.params.id;
    var user=db.get("Users").find({id:id}).value();
    res.render("users/view",{
        user:user
    });
});


//#endregion

app.use("/products",authMiddleware.requireAuth,productRoute);
app.use("/auth", authRoute);

//#region cookie
app.get("/users/cookie",function(req, res){
    res.cookie("userid","123");
    res.send("hello");
});
//#endregion

app.listen(port, function(){
    console.log('Server listening on port '+port);
});