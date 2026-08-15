const db = require("../config/connection");
const createError = require('http-errors');

exports.login = (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (email == null || email.trim() === "") {
            return next(createError(400, "Email is required"));
        }
        if (password == null || password.trim() === "") {
            return next(createError(400, "Password is required"));
        }

        const sql = "SELECT id, name, email FROM users WHERE email = $1 AND password = $2";

        db.query(sql, [email.trim(), password], (err, result) => {
            if (err) {
                return next(err);
            }
            if (!result.rows || result.rows.length === 0) {
                return next(createError(401, "Invalid email or password"));
            }
            const user = result.rows[0];
            return res.status(200).json({
                message: "User authenticated successfully",
                user
            });
        });
    } catch (error) {
        next(error);
    }
};