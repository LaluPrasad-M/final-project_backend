import jwt from 'jsonwebtoken';
import User from "../../models/users.js";

const JWT_KEY = 'final_assignment';

const isValidUser = async (req, res, next) => {
    try {
        const token = req.query.token || req.body.token
        if (token) {
            const decoded = await jwt.verify(token, JWT_KEY);
            req.userData = await User.findById(decoded._id)
            console.log(req.userData, "user");
            if (req.userData.role === "user") {
                return next();
            }
        }
        return res.status(401).json({ message: "Please login with a valid user" });
    } catch (error) {
        console.log(error)
        res.status(401).json({ message: "Invalid User!" });
    }
};

const isValidAdmin = async (req, res, next) => {
    try {
        const token = req.query.token || req.body.token
        if (token) {
            const decoded = await jwt.verify(token, JWT_KEY);
            req.userData = await User.findById(decoded._id)
            console.log(req.userData, "admin");
            if (req.userData.role === "admin") {
                return next();
            }
        }
        return res.status(401).json({ message: "Please login with a valid admin" });
    } catch (error) {
        console.log(error)
        res.status(401).json({ message: "Invalid Admin!" });
    }
};

export default {
    isValidUser,
    isValidAdmin
}