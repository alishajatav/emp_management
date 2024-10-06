const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    console.log("Middleware Block")
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) 
        {
            console.log("!token Block")
            return res.sendStatus(403); // Forbidden
        }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {

            console.log("err Block",err)
            return res.sendStatus(403); // Forbidden
        }
        req.user = user;
        next();
    });
};

module.exports = verifyToken;
