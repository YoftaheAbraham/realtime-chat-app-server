import bcrypt from "bcrypt"

export const hashPassword = async (req, res, next) => {
    if (req.body.password.length < 8) {
        return res.status(400).json({
            status: "fail",
            message: "Password must be at least 8 characters"
        })
    } else {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt)
        next()
    }
}