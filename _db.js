var low=require('lowdb');
var fileSync=require('lowdb/adapters/FileSync');
var adapter=new fileSync('db.json');
var db=low(adapter);
db.defaults({Products:[]})
    .write();

module.exports = db;