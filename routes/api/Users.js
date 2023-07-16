const express = require('express');
const bcryptjs = require('bcryptjs');
const userRouter = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');
const User = require('../../models/User');

//Signup Route
userRouter.post('/signup', async (req, res) => {
    try {
        console.log(req.body);
        const {email, password, username} = req.body;
        if (email=='' || password=='' || username=='') {
            return res.status(400).json({ msg: "Please enter all the fields"});
        }
        if (password.length < 6) {
            return res
                .status(400)
                .json({ msg: "Password should be atleast 6 characters"});
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res
                .status(400)
                .json({ msg: "User with the same email already exists"});
        }
        const hashedPassword = await bcryptjs.hash(password, 8);
        const newUser = new User({email, password: hashedPassword, username});

        const savedUser = await newUser.save();
        console.log(savedUser.username);
        res.json(savedUser);
    } catch (err) {
        res.status(500).json({ error: err.message});
    }
});
 
// Login route
userRouter.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body;
        if (email=='' || password=='') {
            return res.status(400).json({ msg: "Please enter all the fields"});
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res
                .status(400)
                .send({ msg: "User with this email does not exist" });
        }

        const isMatch = await bcryptjs.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).send({ msg: "Incorrect password. "});
        }
        const token = jwt.sign({ id: user._id}, "passwordKey" );
        console.log("User Found");
        return res.json({token, user: {id: user._id, username: user.username}});
        } catch (err) {
            res.status(500).json({ error: err.message});
        }
});

// To check if token is valid
userRouter.post("/tokenIsValid", async (req, res) => {
    try {
        console.log(req);
        const token = req.header("x-auth-token");
        console.log(token);
        if (!token) return res.json(false);
        const verified = jwt.verify(token, "passwordKey");
        if (!verified) return res.json(false);
        const user = await User.findById(verified.id);
        if (!user) return res.json(false);
        return res.json(true);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// to get the users credentials
userRouter.get("/", auth, async (req, res) => {
    const user = await User.findById(req.user);
    res.json({
        username: user.username,
        id: user._id,
    });
});

module.exports = userRouter;