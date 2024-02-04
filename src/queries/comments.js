const pool = require('../../db');


const postComment = async (user_id, quote_id, comment) =>
{
    return (await pool.query('INSERT INTO comments (user_id, quote_id, comment) VALUES ($1, $2, $3) RETURNING *', [user_id, quote_id, comment]))
};

const getCommentsListInQuote = async (user_id, quote_id) =>
{
    return (await pool.query(`
    SELECT
        c.id,
        c.quote_id,
        c.user_id,
        c.comment,
        COALESCE(l.likes, 0) as likes,
        u.username,
        u.picture,
        (CASE
            WHEN EXISTS
                (SELECT 1
                    from likes
                    WHERE user_id = ${ user_id }
                    AND quote_id = c.quote_id
                    AND comment_id = c.id
                )
            THEN 1
            ELSE 0
        END) AS "isUserLiked",
        c.createdat
    FROM comments AS c
    LEFT JOIN users AS u
    ON c.user_id = u.id
    Left JOIN
    (SELECT comment_id,
        CAST(COUNT(*) AS INTEGER) AS likes
        FROM likes
        WHERE comment_id IS NOT NULL
        GROUP BY comment_id
    ) AS l
    ON c.id = l.comment_id
    WHERE quote_id = ${ quote_id }
    ORDER BY c.createdat DESC`
    ))
};

const deleteComment = async (comment_id) =>
{
    return (await pool.query('DELETE FROM comments WHERE id = $1 RETURNING *', [comment_id]))
};

module.exports = {
    postComment,
    getCommentsListInQuote,
    deleteComment
};