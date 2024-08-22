const jwt = require("jsonwebtoken");
require("dotenv").config();

const isAuthenticated = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization)
      return res.send({ success: false, message: "token is required" });

    const { user } = jwt.verify(authorization, process.env.JWT_SECRET);

    if (!user) return res.send({ success: false, message: "user not founc" });

    req.user = user;
    next();
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = isAuthenticated;
