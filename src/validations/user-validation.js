const { body } = require("express-validator");


const registerValidation = () => {
    return [
        body("username").not().isEmpty().withMessage("name is required!").isLength({min: 2, max: 15}).withMessage("name must be between 2 and 15 character length."),
        body("email").not().isEmpty().withMessage("email is required!").isEmail().withMessage("enter a valid email address."),
        body("password").not().isEmpty().withMessage("password is required").isLength({min: 6, max:15}).withMessage("password characters must be greater than 5")
    ]
};

const loginValidation = () => {
    return [
        body("username").not().isEmpty().withMessage("name is required!").isLength({min: 2, max: 15}).withMessage("name must be between 2 and 15 character length."),
        body("password").not().isEmpty().withMessage("password is required").isLength({min: 6}).withMessage("password characters must be greater than 5")
    ]
};

module.exports = {
    registerValidation,
    loginValidation
};