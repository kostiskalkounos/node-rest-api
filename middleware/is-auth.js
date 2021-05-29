const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("Not Authenticated");
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    // decode and verify token (jwt.decode() decodes only)
    decodedToken = jwt.verify(token, "someSuperSecretPrivateKey");
  } catch (err) {
    err.statusCode = 500;
    throw err; // expressjs will handle this error since we're in a middleware
  }
  if (!decodedToken) {
    const error = new Error("Not authenticated");
    error.statusCode = 401;
    throw error;
  }
  req.userId = decodedToken.userId;
  next();
};
