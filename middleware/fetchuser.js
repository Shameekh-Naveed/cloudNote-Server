const jwt = require("jsonwebtoken");

const JWT_SECRET = "shhh";

const fetchUser = (req, res, next) => {
  const tokken = req.header("auth_tokken");
  if (!tokken) {
    return res.status(401).json({ error: "Invalid tokken" });
  }
  try {
    const data = jwt.verify(tokken, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error");
  }
};

module.exports = fetchUser;
