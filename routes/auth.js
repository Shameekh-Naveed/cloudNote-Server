const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchUser = require("../middleware/fetchuser");

const JWT_SECRET = process.env.REACT_APP_JWT_SECRET;

// Creating a User using POST "/api/auth/createUser". Doesnt require login
router.post(
  "/createUser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Minimum Password length is 5").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    let status = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({ status, errors: errors.array() });
    }

    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ status, error: "Email already used" });
      }

      // converrting password to hash
      const salt = await bcrypt.genSalt(10);
      const secPassword = await bcrypt.hash(req.body.password, salt);

      // Make a new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPassword,
      });

      data = {
        user: {
          id: user.id,
        },
      };
      const auth_tokken = jwt.sign(data, JWT_SECRET);
      status = true;
      res.json({ status, auth_tokken });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Some error occured");
    }
    // console.log(req.body);
    // const user = User(req.body);
    // user.save();
    // OR USING PROMISE
    //   User.create({
    //     name: req.body.name,
    //     email: req.body.email,
    //     password: req.body.password,
    //   })
    //     .then((user) => res.json(user))
    //     .catch((err) => console.log(err));
  }
);

// Loging in a previous user using POST "/api/auth/login". Doesnt require login
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Pssword can not be blank").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    let status = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({ status, errors: errors.array() });
    }

    try {
      const { email, password } = req.body;
      // Validating Email
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ status, error: "Invalid Credentials" });
      }

      // Validating Password
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({ status, error: "Invalid Credentials" });
      }
      data = {
        user: {
          id: user.id,
        },
      };
      const auth_tokken = jwt.sign(data, JWT_SECRET);
      status = true;
      res.json({ status, auth_tokken });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

// get logged in user details using POST "/api/auth/getuser". Doesnt require login
router.post("/getuser", fetchUser, async (req, res) => {
  try {
    let userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
