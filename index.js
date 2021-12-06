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

var userRoute = require("./routes/user.route");
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

//#endregion

app.use("/users", authMiddleware.requireAuth, userRoute);
app.use("/products",authMiddleware.requireAuth, productRoute);
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