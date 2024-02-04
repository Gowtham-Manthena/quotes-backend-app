CREATE TABLE users(
    id SERIAL PRIMARY KEY NOT NULL,
    username VARCHAR(30) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(15) NOT NULL
);


CREATE TABLE quotes(
    id SERIAL PRIMARY KEY NOT NULL,
    user_id INT NOT NULL,
    quote VARCHAR(600) NOT NULL,
    comments INT DEFAULT 0,
    likes INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id)
);


CREATE TABLE comments (
    id SERIAL PRIMARY KEY NOT NULL,
    quote_id INT NOT NULL,
    user_id INT NOT NULL,
    comment VARCHAR(600) NOT NULL,
    likes INT NOT NULL DEFAULT 0,
    FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE likes (
    id SERIAL PRIMARY KEY NOT NULL,
    user_id INT NOT NULL,
    quote_id INT NOT NULL,
    comment_id INT DEFAULT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(quote_id) REFERENCES quotes(id) ON DELETE CASCADE,
    FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE
);

-- alter likes table
ALTER COLUMN likes
ALTER COLUMN quote_id NOT NULL;


INSERT INTO comments (comment, likes, quote_id)
VALUES (
        'Well then, add your second quote :)',
        1,
        1
    );


-- rename the column name
ALTER TABLE quotes
    RENAME COLUMN "createdAt" to "createdat";


--quotes call with left join and COALESCE function
--The COALESCE function is used to handle cases where there are no likes, replacing NULL with 0. This is achieved through a left join with a subquery that counts likes from the likes table.
--In SQL, SELECT 1 is a common way to check for the existence of at least one record
SELECT q.id,
    q.user_id,
    q.quote,
    CAST(COUNT(c.comment) AS INTEGER) AS comments_count,
    COALESCE(l.likes, 0) AS likes,
    (
        CASE
            WHEN EXISTS (
                SELECT 1
                FROM likes
                WHERE user_id = 27
                    AND quote_id = q.id
                    AND comment_id IS NULL
            ) THEN 1
            ELSE 0
        END
    ) AS "isUserLiked",
    q.createdat
FROM quotes AS q
    LEFT JOIN comments AS c ON q.id = c.quote_id
    LEFT JOIN (
        SELECT quote_id,
            comment_id,
            CAST(COUNT(*) AS INTEGER) as likes
        FROM likes
        WHERE comment_id IS NULL
        GROUP BY quote_id,
            comment_id
    ) AS l ON q.id = l.quote_id
GROUP BY q.id,
    l.likes
ORDER BY q.createdat;


-- get comments by quote id including likes.
SELECT c.id,
    c.quote_id,
    c.user_id,
    c.comment,
    COALESCE(l.likes, 0) as likes,
    (
        CASE
            WHEN EXISTS (
                SELECT 1
                from likes
                WHERE user_id = c.user_id
                    AND quote_id = c.quote_id
                    AND comment_id = c.id
            ) THEN 1
            ELSE 0
        END
    ) AS "isUserLiked",
    c.createdat
FROM comments AS c
    Left JOIN (
        SELECT comment_id,
            CAST(COUNT(*) AS INTEGER) AS likes
        FROM likes
        WHERE comment_id IS NOT NULL
        GROUP BY comment_id
    ) AS l ON c.id = l.comment_id
WHERE quote_id = $ { quote_id }
ORDER BY c.createdat DESC;


-- alter comments table and add "user_id" column
ALTER table comments
ADD column user_id INT DEFAULT null;


-- alter comments table
ALTER TABLE comments
ADD COLUMN createdat timestamp default current_timestamp;


-- get quotes in which user added comments( function example )
CREATE OR REPLACE FUNCTION get_quotes_with_comments(user_id INTEGER) RETURNS JSONB AS $$
DECLARE result JSONB;
BEGIN
SELECT jsonb_build_object(
        'id',
        quotes.id,
        'quote',
        quotes.quote,
        'comments',
        jsonb_agg(
            jsonb_build_object(
                'id',
                comments.id,
                'comment',
                comments.comment
            )
        )
    ) INTO result
FROM quotes
    JOIN comments ON quotes.id = comments.quote_id
WHERE quotes.user_id = get_quotes_with_comments.user_id -- qualify the column reference
GROUP BY quotes.id,
    quotes.quote
ORDER BY quotes.id;
RETURN COALESCE(result, '[]'::JSONB);
END;
$$ LANGUAGE plpgsql;


/*sadfg*/
get quotes in which user added comments(function example)
select q.id,
    q.quote,
    c.id,
    c.quote_id,
    c.comment
from quotes as q
    join comments as c ON q.id = c.quote_id
WHERE q.user_id = 24
ORDER BY q.id;