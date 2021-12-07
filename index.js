require('dotenv').config();
// console.log(process.env);

var express=require('express');
var app=express();
var bodyParser=require('body-parser');
var shortid=require('shortid');
var cookieParser = require("cookie-parser");
var csurf = require('csurf');

// app.use(function (req, res, next) {
//     res.cookie('XSRF-TOKEN', req.csrfToken());
//     res.locals.csrftoken = req.csrfToken();
//     next();
// });

var authRoute = require("./routes/auth.route");
var userRoute = require("./routes/user.route");
var productRoute = require("./routes/product.route");
var cartRoute = require("./routes/cart.route");
var transferRoute = require("./routes/transfer.route");

var sessionMiddleware = require('./middlewares/session.middleware');
var authMiddleware = require("./middlewares/auth.middleware");


var port=5000;
app.set('view engine','pug');
app.set('views','./views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static('public'));
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(sessionMiddleware);

app.get('/', function(req, res){
    //res.send('Welcome Node.js');
    res.render('index',{
        copy:'Kingo'
    }
    );
});

app.use("/auth", authRoute);
app.use(csurf({cookie: true}));
app.use("/users", authMiddleware.requireAuth, userRoute);
app.use("/products",productRoute);
app.use("/cart", cartRoute);
app.use("/transfer", authMiddleware.requireAuth, transferRoute);

app.listen(port, function(){
    console.log('Server listening on port '+port);
});