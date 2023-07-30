const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // Отримуємо токен
    const [tokenType, token] = req.headers.authorization.split(" ");

    if (tokenType !== "Bearer") {
      res.status(401);
      throw new Error("It's not Bearer token");
    }

    if (token) {
      // Розшифровуємо токен
      const decoded = jwt.verify(token, "pizza");

      // Передаємо далі дані про клористувача
      req.user = decoded.id;
      next();
    }
  } catch (error) {
    res.status(401).json({ code: 401, message: error.message });
  }
};
