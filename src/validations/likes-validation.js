const { body } = require("express-validator");

const likesValidation = () =>
{
    return [
        body('user_id').not().isEmpty().withMessage("user id is required."),
        body('quote_id').not().isEmpty().withMessage("quote id is required")
    ];
};

module.exports = {
    likesValidation
};