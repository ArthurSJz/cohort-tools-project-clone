const express = require("express");
const User = require("../Models/User.model");
const isAuthenticated = require("../middleware/jwt.middleware");

const router = express.Router();

router.get("/users/:id", isAuthenticated, async (req, res) =>{
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User net found"});
        }
        res.json(user);
    } catch (err){
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;