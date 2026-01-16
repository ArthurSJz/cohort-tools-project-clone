const router = require("express").Router();
const UserModel = require("../Models/User.model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const isAuthenticated = require("../middleware/jwt.middleware");

// SIGNUP
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(403).json({ errorMessage: "Invalid Credentials" });
    }

    const hashedPassword = bcryptjs.hashSync(password, bcryptjs.genSaltSync(12));
    const newUser = await UserModel.create({
      ...req.body,
      password: hashedPassword,
    });

    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ errorMessage: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(403).json({ errorMessage: "Invalid Credentials" });
    }

    const passwordsMatch = bcryptjs.compareSync(password, user.password);
    if (!passwordsMatch) {
      return res.status(403).json({ errorMessage: "Invalid Credentials" });
    }

    const payload = { _id: user._id };
    const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "6h",
    });

    res.status(200).json({ authToken });
  } catch (err) {
    res.status(500).json({ errorMessage: err.message });
  }
});

// VERIFY TOKEN (PROTECTED)
router.get("/verify", isAuthenticated, (req, res) => {
  res.status(200).json({
    message: "Token is valid",
    decodedToken: req.payload,
  });
});

module.exports = router;