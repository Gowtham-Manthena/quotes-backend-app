const { body } = require("express-validator");


const addCommentValidation = () =>
{
    return [
        body('comment').not().isEmpty().withMessage("comment is required").isLength({min: 3, max:200}).withMessage("comment should be between 3 and 200 characters."),
        body('quote_id').not().isEmpty().withMessage("quote id is required.")
    ];
};

module.exports = {
    addCommentValidation
}