const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json("You are not authenticated")
    }
    jwt.verify(token, process.env.SECRET, async (err, data) => {
        if (err) {
            res.status(403).json("Token is not valid")
        }
        req.useId = data.useId
        next();
    })
}


module.exports = verifyToken;