const { body } = require("express-validator");


const addQuoteValidation = () => {
    return [
        body("quote").not().isEmpty().withMessage("quote shoud not be empty :(").isLength({min: 3, max:600}).withMessage("quote should be between 3 and 600 characters."),
    ]
};

module.exports = {
    addQuoteValidation,
};