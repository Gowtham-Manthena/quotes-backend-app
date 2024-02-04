const express = require('express');
const bcrypt = require('bcrypt');
const { registerValidation, loginValidation } = require('../validations/user-validation');
const validationHandler = require('../validations/validation-handler');
const { generateToken, authorizeToken } = require('../jwt/jwt-handler');
const { getUsers, addUser } = require('../queries/user');

const router = express.Router();

// register
router.post('/register', registerValidation(), validationHandler, async (req, res) =>
{
    try
    {
        const { username, email, password } = req.body;

        const user = await getUsers(username);

        if (user && user.rows.length)
        {
            return res.status(403).json({
                status: 0,
                message: "user already exists!"
            });
        }

        const salt = await bcrypt.genSalt(10)

        const hashPassword = await bcrypt.hash(password, salt);

        const result = await addUser(username, email, hashPassword);

        if (!result || !result.rows.length)
        {
            res.json({
                status: 0,
                error: result,
                message: 'user not registered!'
            })

            return;
        }

        const userId = result.rows[0].id;

        const jwtToken = await generateToken({ id: userId, username: username });

        if (!jwtToken)
        {
            return res.json({
                status: 0,
                error: null,
                message: "unable to assign a token for you :("
            })
        }

        return res.status(200).json({
            status: 1,
            data: {
                token: jwtToken,
                user: {
                    id: result.rows[0].id,
                    username: username
                }
            },
            message: "welcome to the app!"
        })

    } catch (error)
    {
        return res.json({
            status: 0,
            error: error.stack,
            message: error.message
        })
    }
});

//login

router.post('/login', loginValidation(), validationHandler, async (req, res) =>
{
    const { username, password } = req.body;

    try
    {
        const user = await getUsers(username);

        if (!user || !user.rows.length)
        {
            res.status(401).json({
                status: 0,
                message: "username or password is incorrect!"
            })

            return;
        }

        const checkPassword = await bcrypt.compare(password.trim(), user.rows[0].password.trim());

        if (!checkPassword)
        {
            res.status(401).json({
                status: 0,
                message: "password is incorrect!"
            })

            return;
        }

        const userId = user.rows[0].id;

        const jwtToken = await generateToken({ id: userId, username: username });

        if (!jwtToken)
        {
            return res.json({
                status: 0,
                error: null,
                message: "unable to assign a token for you :("
            })
        }

        return res.status(200).json({
            status: 1,
            data: {
                token: jwtToken,
                user: {
                    id: user.rows[0].id,
                    username: user.rows[0].username
                }
            },
            message: `welcome back ${user.rows[0].username}!`
        })

    } catch (error)
    {
        return res.json({
            status: 0,
            error: error.stack,
            message: error.message
        })
    }

});

// log out
router.post('/logout', authorizeToken, async (req, res) =>
{
    try
    {
        await generateToken(req.user);

        return res.status(200).json({
            status: 1,
            message: "loged out successfully"
        })

    } catch (error)
    {
        return res.status(403).json({
            status: 0,
            message: "something went wrong",
            error: error.stack
        })
    }
})

module.exports = router;