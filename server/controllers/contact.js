exports.postMessage = (req,res,next) => {
    try{
        let name = req.name, email = req.email, subject = req.subject, message = req.message;

        if(name == null || name.trim() == ""){

        }
        else if(email == null || email.trim() == ""){

        }
        else if(subject == null || subject.trim() == ""){

        }
        else if(message == null || message.trim() == ""){

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