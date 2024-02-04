const express = require("express");
const { authorizeToken } = require("../jwt/jwt-handler");
const { addCommentValidation } = require("../validations/comments-validation");
const validationHandler = require("../validations/validation-handler");
const { postComment, deleteComment, getCommentsListInQuote } = require("../queries/comments");

const router = express.Router();


router.get('/get/comments/by/quote/:id', authorizeToken, async (req, res) =>
{
    try
    {
        const user = req.user;

        if (!user)
        {
            return res.status(404).json({
                status: 0,
                message: "unable to get user",
            });
        }

        const quoteId = req.params.id;

        const getListOfComments = await getCommentsListInQuote(user.id, quoteId);

        if (!getListOfComments || !getListOfComments.rows)
        {
            return res.status(400).json({
                status: 0,
                message: "failed to get comments",
            });
        }

        return res.status(200).json(
            {
                status: 1,
                data: {
                    comments: getListOfComments.rows
                }
            }
        )

    } catch (error)
    {
        return res.status(400).json({
            status: 0,
            message: "Ooops! unable to get the comments.",
            error: error.stack
        })
    }
})

router.post('/post/comment', authorizeToken, addCommentValidation(), validationHandler, async (req, res) =>
{
    try
    {
        const { quote_id, comment } = req.body;

        const user = req.user;

        if (!user)
        {
            return res.status(404).json({
                status: 0,
                message: "unable to get user",
            });
        }

        const postCommentRes = await postComment(user.id, quote_id, comment);

        if (!postCommentRes || !postCommentRes.rows)
        {
            return res.status(400).json({
                status: 0,
                message: "failed to upload comment",
            });
        }

        return res.status(200).json(
            {
                status: 1,
                data: {
                    comment: postCommentRes.rows[0]
                },
            }
        );

    } catch (error)
    {
        return res.status(400).json({
            status: 0,
            message: "Ooops! unable to add the comment.",
            error: error.stack
        });
    }
})

router.post('/delete/comment', authorizeToken, async (req, res) =>
{
    try
    {
        const id = req.body.id;

        const deleteCommentRes = await deleteComment(id);

        console.log("deleteres", deleteCommentRes)

        if (!deleteCommentRes || !deleteCommentRes.rows.length)
        {
            return res.status(400).json({
                status: 0,
                message: "failed to delete comment",
            });
        }

        return res.status(200).json(
            {
                status: 1,
                data: {
                    quote: deleteCommentRes.rows[0]
                },
                message: "deleted the comment successfully."
            }
        );

    } catch (error)
    {
        return res.status(400).json({
            status: 0,
            message: "Ooops! unable to delete the comment.",
            error: error.stack
        });
    }
})

module.exports = router;