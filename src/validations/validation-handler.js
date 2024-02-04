const { validationResult } = require("express-validator");

const validationHandler = (req, res, next) =>
{
    const errors = validationResult(req);

    console.log('checkERRORS', errors)

    if (errors.isEmpty())
    {
        return next(); 
    }

    let errorMessage = '';

    errors.array().map((err, index) =>
    {
        if (index != 0)
        {
            errorMessage += ', '
        }

        errorMessage += err.msg;

        if (index == errors.errors.length - 1)
        {
            errorMessage += '.'
        }
    });

    return res.json({
        status: 0,
        message: errorMessage
    })
}

module.exports = validationHandler;