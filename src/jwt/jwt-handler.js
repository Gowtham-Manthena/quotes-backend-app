const jwt = require('jsonwebtoken');
require('dotenv').config();


const generateToken = async (user) =>
{
    return await jwt.sign({ id: user.id, username: user.username }, process.env.SECRET_TOKEN_KEY, {
        expiresIn: '2hr'
    })
};

const authorizeToken = (req, res, next) =>
{
    try
    {
        const token = req.headers['mgtoken'];

        if (!token)
        {
            return res.status(401).json({
                status: 0,
                message: "token not found",
                req: JSON.stringify(req.headers)
            })
        }

        jwt.verify(token, process.env.SECRET_TOKEN_KEY, (err, user) =>
        {
            if (err)
            {
                return res.status(403).json({
                    status: 0,
                    message: "Your token is expired. Login again :(",
                    req: JSON.stringify(req.headers)
                });
            }

            req.user = user;

            next();
        })

    } catch (error)
    {
        return res.status(400).json({
            status: 0,
            message: "something went wrong during authorization",
            error: error.stack
        })
    }
};

module.exports = {
    generateToken,
    authorizeToken
}