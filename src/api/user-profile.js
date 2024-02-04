const express = require("express");
const { authorizeToken } = require("../jwt/jwt-handler");
const { editUser, getUser } = require("../queries/user");
const multer = require('multer');
const path = require('path');

const router = express.Router();


// multer middleware to handle images locally since we are not using and cloud services to store the images
//  storage is the place where we decide in which place we want to store the image and the name of the image(name should be unique so pass date obj to name).
//  It will be passed to the multer object in upload middleware.
// The disk storage engine gives you full control on storing files to disk.
// Multer adds a body object and a file or files object to the request object.
// upload.single("file")--- here "file" is the name of the input (this is IMP)

const storage = multer.diskStorage({
    destination: (req, file, callback) =>
    {
        callback(null, 'public/images');
    },
    filename: (req, file, callback) =>
    {
        callback(null, `${ Date.now() }_${ file.originalname }`);
    }
})

const upload = multer({ storage: storage });

router.post('/upload/photo', upload.single("file"), authorizeToken, async (req, res) =>
{
    try
    {
        const file = req.file;

        const user = req.user;

        if (!user)
        {
            return res.status(404).json({
                status: 0,
                message: "unable to get user",
            });
        }

        console.log("file===", req.file)
        // return res.json({file: file})

        if (file && !file.filename)
        {
            return res.status(400).json({
                status: 0,
                message: "Something went wrong!",
            });
        }

        const result = await editUser(user.id, null, !file ? null : file.filename);

        if (!result || !result?.rows.length)
        {
            return res.status(400).json({
                status: 0,
                message: "Unable to update the profile!",
            });
        }

        return res.status(200).json(
            {
                status: 1,
                message: "profile updated successfully"
            }
        )

    } catch (error)
    {
        return res.status(500).json({
            status: 0,
            message: "Ooops! unable to save profile pic :(",
            error: error.stack
        });
    }
})

router.get('/get/user', authorizeToken, async (req, res) =>
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

        const result = await getUser(user.id);

        if (!result || !result?.rows.length)
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
                    user: result.rows[0]
                }
            }
        )

    } catch (error)
    {
        return res.status(500).json({
            status: 0,
            message: "unable to get user",
            error: error.stack
        });
    }
})


module.exports = router;