const pool = require('../../db')


const addLikeToQuote = async (user_id, quote_id) =>
{
    return (await pool.query('INSERT INTO likes (user_id, quote_id) VALUES ($1, $2)', [user_id, quote_id]))
};

const removeLikeFromQuote = async (user_id, quote_id) =>
{
    return (await pool.query('DELETE FROM likes WHERE user_id = $1 AND quote_id = $2', [user_id, quote_id]))
};

const addLikeToComment = async (user_id, quote_id, comment_id) =>
{
    return (await pool.query('INSERT INTO likes (user_id, quote_id, comment_id) VALUES ($1, $2, $3)', [user_id, quote_id, comment_id]))
};

const removeLikeFromComment = async (user_id, quote_id, comment_id) =>
{
    return (await pool.query('DELETE FROM likes WHERE user_id = $1 AND quote_id = $2 AND comment_id = $3', [user_id, quote_id, comment_id]))
};

module.exports = {
    addLikeToQuote,
    removeLikeFromQuote,
    addLikeToComment,
    removeLikeFromComment
}