const db = require("../config/connection");
const createError = require('http-errors');

exports.login = (req,res,next) => {
    try{
        const {email, password} = req.body;

        if(email == null || email.trim() == ""){
            return next(createError(400, "Email is required"));
        }
        if(password == null || password.trim() == ""){
            return next(createError(400, "Passowrd is required"));
        }

        let sql = "select id from users where email = ? and password = ?";

        db.query(sql,[email, password], (err, result) => {
            if(err){
                return next(err);
            }
            res.status(200).json({
                message: "User exists"
            })
        })
    }
    catch(error){

    }
}