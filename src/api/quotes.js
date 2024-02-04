const express = require('express');
const { authorizeToken } = require('../jwt/jwt-handler');
const { getAllQuotes, addQuote, getQuotesWithCommentsByUser, getQuotesByUser, deleteQuote } = require('../queries/quotes');
const { addQuoteValidation } = require('../validations/quotes-validation');
const validationHandler = require('../validations/validation-handler');

const router = express.Router()

router.get('/get/all/quotes', authorizeToken, async (req, res) =>
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

        const quotesList = await getAllQuotes(user.id);

        if (!quotesList || !quotesList?.rows)
        {
            return res.status(400).json({
                status: 0,
                message: "quotes are not found",
            });
        }

        return res.status(200).json(
            {
                status: 1,
                data: {
                    quotes: quotesList.rows
                }
            }
        )

    } catch (error)
    {
        return res.status(400).json({
            status: 0,
            message: "unable to get quotes",
            error: error.stack
        });
    }
})

router.get('/get/quotes/for/which/user/added/comments', authorizeToken, async (req, res) =>
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

        const quotesWithComments = await getQuotesWithCommentsByUser(user.id);

        if (!quotesWithComments || !quotesWithComments.rows)
        {
            return res.status(400).json({
                status: 0,
                message: "No quotes found"
            })
        }

        let finalArray = [];

        for (let i = 0; i < quotesWithComments.rows.length; i++)
        {
            let quoteObj = quotesWithComments.rows[i];

            let matchedQuoteIndex = finalArray.findIndex(item => item.id === quoteObj.id);

            if (matchedQuoteIndex !== -1)
            {
                finalArray[matchedQuoteIndex]?.comments.push({
                    id: quoteObj.comment_id,
                    comment: quoteObj.comment
                })

                continue;
            }

            finalArray.push({
                id: quoteObj.id,
                quote: quoteObj.quote,
                username: quoteObj.username,
                picture: quoteObj.picture,
                comments: [
                    {
                        id: quoteObj.comment_id,
                        comment: quoteObj.comment
                    }
                ]
            })
        }

        return res.status(200).json({
            status: 1,
            data: {
                quotes: finalArray
            }
        })


    } catch (error)
    {
        return res.status(400).json({
            status: 0,
            message: "unable to get quotes with comments",
            error: error.stack
        });

    }
});

router.get('/get/quotes/by/user', authorizeToken, async (req, res) =>
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

        const quotesResult = await getQuotesByUser(user.id);

        if (!quotesResult || !quotesResult.rows)
        {
            return res.status(400).json({
                status: 0,
                message: "No quotes found"
            })
        }

        return res.status(200).json({
            status: 1,
            data: {
                quotes: quotesResult.rows
            }
        })

    } catch (error)
    {
        return res.status(400).json({
            status: 0,
            message: "unable to get your quotes.",
            error: error.stack
        });
    }
});

router.post('/add/quote', authorizeToken, addQuoteValidation(), validationHandler, async (req, res) =>
{
    const { quote } = req.body;
    const user = req.user;

    try
    {
        const postQuote = await addQuote(user.id, quote);

        if (!postQuote || !postQuote?.rows)
        {
            return res.status(400).json({
                status: 0,
                message: "failed to upload quote",
            });
        }

        return res.status(200).json(
            {
                status: 1,
                message: "added successfully",
                data: {
                    quote: postQuote.rows[0]
                }
            }
        )

    } catch (error)
    {
        return res.status(400).json({
            status: 0,
            message: "something went wrong while adding quote",
            error: error.stack
        });
    }
});

router.post('/delete/quote/:id', authorizeToken, async (req, res) =>
{
    const { id } = req.params;

    try
    {
        const postQuote = await deleteQuote(id);

        if (!postQuote || !postQuote?.rows)
        {
            return res.status(400).json({
                status: 0,
                message: "failed to delete quote",
            });
        }

        return res.status(200).json(
            {
                status: 1,
                message: "deleted successfully"
            }
        )

    } catch (error)
    {
        return res.status(400).json({
            status: 0,
            message: "something went wrong",
            error: error.stack
        });
    }
})

module.exports = router;