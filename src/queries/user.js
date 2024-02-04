const pool = require('../../db');

const getUsers = async (username) =>
{
    return (await pool.query("SELECT * FROM users WHERE username = $1", [username]));
};

const getUser = async (user_id) =>  
{
    return (await pool.query("SELECT * FROM users WHERE id = $1", [user_id]));
};

const addUser = async (username, email, hashPassword) =>
{
    return (await pool.query("INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id", [username, email, hashPassword]));
};

const editUser = async (user_id, hashPassword, picture) =>
{
    let updateUser = [];
    let query = ""

    if (hashPassword)
    {
        updateUser.push(hashPassword, user_id);
        query = "UPDATE users SET password = $1 WHERE id = $2 RETURNING *";
    }
    else
    {
        updateUser.push(picture, user_id);
        query = "UPDATE users SET picture = $1 WHERE id = $2 RETURNING *";
    }

    return (await pool.query(query, updateUser));
};

module.exports = {
    getUsers,
    getUser,
    addUser,
    editUser
}
