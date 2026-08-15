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

    }
    catch(error){
        next(error.message);
    }
}

exports.getMessage = (req,res,next) => {
    try{
        let sql = "select * from messages order by date asc";
    }
    catch(error){
        next(error.message);
    }
}