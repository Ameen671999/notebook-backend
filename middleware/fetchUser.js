const jwt = require("jsonwebtoken");

const JWT_SECRET = "AmeenHeroKhan";

const fetchUser = (req, res, next) => {
  // Get hte user from the jwt and add id to req obj
  const token = req.header("auth-token"); // same as header we sent
  if (!token) {
    res.status(401).send({ error: "Please authenticate using valid token" });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate using valid token" });
  }
};

module.exports = fetchUser;
