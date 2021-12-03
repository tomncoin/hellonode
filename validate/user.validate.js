module.exports.postCreate=function(){
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
    next();
};