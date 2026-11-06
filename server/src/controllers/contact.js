const createError = require("http-errors");
const db = require("../config/connection");

exports.postMessage = (req, res, next) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || name.trim() === "") {
            return next(createError(400, "Name is required"));
        }
        if (!email || email.trim() === "") {
            return next(createError(400, "Email is required"));
        }
        if (!subject || subject.trim() === "") {
            return next(createError(400, "Subject is required"));
        }
        if (!message || message.trim() === "") {
            return next(createError(400, "Message is required"));
        }

        const sql = "INSERT INTO messages (name, email, subject, message) VALUES ($1, $2, $3, $4)";

        db.query(sql, [name.trim(), email.trim(), subject.trim(), message.trim()], (err, result) => {
            if (err) {
                return next(err);
            }
            return res.status(200).json({
                message: "Message Sent Successfully!"
            });
        });
    } catch (error) {
        next(error);
    }
};

exports.getMessages = (req, res, next) => {
    try {
        const { filter } = req.query;
        let sql = "SELECT * FROM messages ORDER BY created_at DESC";
        let params = [];

        if (filter === 'unseen' || filter === 'unvisited') {
            sql = "SELECT * FROM messages WHERE seen = false ORDER BY created_at DESC";
        } else if (filter === 'seen' || filter === 'visited') {
            sql = "SELECT * FROM messages WHERE seen = true ORDER BY created_at DESC";
        }

        db.query(sql, params, (err, result) => {
            if (err) {
                return next(err);
            }
            return res.status(200).json({
                messages: result.rows
            });
        });
    } catch (error) {
        next(error);
    }
};

exports.getMessage = (req, res, next) => {
    try {
        const id = req.params.id || req.body.id;

        if (!id) {
            return next(createError(400, "Invalid Id"));
        }

        const sql = "SELECT * FROM messages WHERE id = $1";
        db.query(sql, [id], (err, result) => {
            if (err) {
                return next(err);
            }
            return res.status(200).json({
                message: result.rows[0] || null
            });
        });
    } catch (error) {
        next(error);
    }
};

exports.seen = (req, res, next) => {
    try {
        const id = req.params.id || req.body.id;
        const seenStatus = req.body.seen !== undefined ? req.body.seen : true;

        if (!id) {
            return next(createError(400, "Invalid Id"));
        }

        const sql = "UPDATE messages SET seen = $1 WHERE id = $2 RETURNING *";

        db.query(sql, [seenStatus, id], (err, result) => {
            if (err) {
                return next(err);
            }
            return res.status(200).json({
                message: "Marked as seen!",
                data: result.rows[0]
            });
        });
    } catch (error) {
        next(error);
    }
};