const express = require("express");
const { authorizeToken } = require("../jwt/jwt-handler");
const { addLikeToQuote, addLikeToComment, removeLikeFromComment, removeLikeFromQuote } = require("../queries/likes");
const { likesValidation } = require("../validations/likes-validation");
const validationHandler = require("../validations/validation-handler");

const router = express.Router();


router.post('/add/like', authorizeToken, likesValidation(), validationHandler, async (req, res) =>
{
    const { user_id, quote_id, comment_id = null } = req.body;
    try
    {
        let postLikeRes = null;

        if(comment_id)
        {
            postLikeRes = await addLikeToComment(user_id, quote_id, comment_id);
        }
        else
        {
            postLikeRes = await addLikeToQuote(user_id, quote_id);
        }

        if (!postLikeRes)
        {
            return res.status(400).json({
                status: 0,
                message: "failed to give the like",
            });
        }

        return res.status(200).json(
            {
                status: 1,
                message: "liked the post successfully :)"
            }
        );

    } catch (error)
    {
        return res.status(400).json({
            status: 0,
            message: "Ooops! unable to give like to the post",
            error: error.stack
        });
    }
})

router.post('/remove/like', authorizeToken, likesValidation(), validationHandler, async (req, res) =>
{
    const { user_id, quote_id, comment_id = null } = req.body;
    try
    {
        let removeLikeRes = null;

        if(comment_id)
        {
            removeLikeRes = await removeLikeFromComment(user_id, quote_id, comment_id);
        }
        else
        {
            removeLikeRes = await removeLikeFromQuote(user_id, quote_id);
        }

        if (!removeLikeRes)
        {
            return res.status(400).json({
                status: 0,
                message: "failed to remove the like",
            });
        }

        return res.status(200).json(
            {
                status: 1,
                message: "Removed the like successfully :)"
            }
        );

    } catch (error)
    {
        return res.status(400).json({
            status: 0,
            message: "Ooops! unable to remove the like from the post",
            error: error.stack
        });
    }
})

module.exports = router;