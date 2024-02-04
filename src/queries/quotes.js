const pool = require('../../db');

const getQuotesByUser = async (userId) =>
{
    return (await pool.query(`
    SELECT
        q.id,
        q.user_id,
        q.quote,
        CAST(COUNT(c.comment) AS INTEGER) AS comments_count,
        COALESCE(l.likes, 0) AS likes,
        (CASE WHEN EXISTS (SELECT 1 FROM likes WHERE user_id = ${userId} AND quote_id = q.id AND comment_id IS NULL) THEN 1 ELSE 0 END) AS "isUserLiked",
        q.createdat
    FROM quotes AS q
    LEFT JOIN comments AS c
    ON q.id = c.quote_id
	LEFT JOIN
	    (SELECT quote_id, comment_id, CAST(COUNT(*) AS INTEGER) as likes FROM likes WHERE comment_id IS NULL GROUP BY quote_id, comment_id) AS l
	ON q.id = l.quote_id
    WHERE q.user_id = ${userId}
    GROUP BY q.id, l.likes
    ORDER BY q.createdat DESC`));
};

const getAllQuotes = async (user_id) =>
{
    return (await pool.query(`
    SELECT
        q.id,
        q.user_id,
        q.quote,
        CAST(COUNT(c.comment) AS INTEGER) AS comments_count,
        COALESCE(l.likes, 0) AS likes,
        u.username,
        u.picture,
        (CASE WHEN EXISTS (SELECT 1 FROM likes WHERE user_id = ${user_id} AND quote_id = q.id AND comment_id IS NULL) THEN 1 ELSE 0 END) AS "isUserLiked",
        q.createdat
    FROM quotes AS q
    LEFT JOIN users AS u
    ON q.user_id = u.id
    LEFT JOIN comments AS c
    ON q.id = c.quote_id
	LEFT JOIN
	    (SELECT quote_id, comment_id, CAST(COUNT(*) AS INTEGER) as likes FROM likes WHERE comment_id IS NULL GROUP BY quote_id, comment_id) AS l
	ON q.id = l.quote_id
    GROUP BY q.id, l.likes, u.username, u.picture
    ORDER BY q.createdat DESC
`));
};

const addQuote = async (userId, quote) =>
{
    return (await pool.query("INSERT INTO quotes (user_id, quote) VALUES ($1, $2) RETURNING *", [userId, quote]));
};

const deleteQuote = async (id) =>
{
    return (await pool.query("DELETE FROM quotes WHERE id=$1", [id]))
};

const getQuotesWithCommentsByUser = async (user_id) =>
{
    return await pool.query(`select q.id, q.quote, c.id as comment_id, c.comment, u.username, u.picture from quotes as q
    LEFT JOIN users as u
    ON q.user_id = u.id
    JOIN comments as c
    ON q.id = c.quote_id
    where c.user_id = ${ user_id }
    ORDER BY q.id`)
};

module.exports = {
    getQuotesByUser,
    getAllQuotes,
    addQuote,
    deleteQuote,
    getQuotesWithCommentsByUser
}
