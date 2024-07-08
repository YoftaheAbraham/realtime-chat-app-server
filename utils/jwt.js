import jwt from "jsonwebtoken";

export const createToken = (payloadKey, secret) => {
    try {
        return jwt.sign(payloadKey, secret, { expiresIn: "90d" });
    } catch (error) {
        throw Error(error.message)
    }
}

export const validateToken = (req, res, next) => {
    try {
        const token = req.headers["authorization"].split(" ")[1];
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        next();
    } catch (error) {
        res.json({
            status: "fail",
            message: error.message
        })
    }
}