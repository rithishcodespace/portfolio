const createError = require("http-errors");
const db = require("../config/connection");

exports.postMessage = (req,res,next) => {
    try{
        let name = req.body.name, email = req.body.email, subject = req.body.subject, message = req.body.message;

        if(name == null || name.trim() == ""){
            if (!name || name.trim() === "") {
                return next(createError(400, "Name is required"));
            }
        }
        else if(email == null || email.trim() == ""){
            if (!name || name.trim() === "") {
                return next(createError(400, "Email is required"));
            }
        }
        else if(subject == null || subject.trim() == ""){
            if (!name || name.trim() === "") {
                return next(createError(400, "Subject is required"));
            }
        }
        else if(message == null || message.trim() == ""){
            if (!name || name.trim() === "") {
                return next(createError(400, "Message is required"));
            }
        }

        let sql = "insert into messages values (?, ?, ?, ?)";

        db.query(sql, [name, email, subject, message], (err, res) => {
            if(err){
                return next(err);
            }
            res.status(200).json({
                message: "Message Sent Sucessfully!"
            });
        })

    }
    catch(error){
        next(error.message);
    }
}

exports.getMessages = (req,res,next) => {
    try{
        let sql = "select * from messages order by date asc";
        db.query(sql,(err,res) => {
            if(err){
                next(err);
            }
            res.status(200).json({
                messages: res
            });
        })
    }
    catch(error){
        next(error.message);
    }
}

exports.getMessage = (req,res,next) => {
    try{
        let id = req.params.id;

        if(id == null || id.trim() == ""){
             return next(createError(400, "Invalid Id"));
        }

        let sql = "select * from messages order by date asc";
        db.query(sql,(err,res) => {
            if(err){
                next(err);
            }
            res.status(200).json({
                messages: res
            });
        })
    }
    catch(error){
        next(error.message);
    }
}