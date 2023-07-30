const jwt = require("jsonwebtoken");

module.exports = (rolesArr) => {
  return (req, res, next) => {
    try {
      // Отримуємо токен
      const [tokenType, token] = req.headers.authorization.split(" ");

      if (tokenType !== "Bearer") {
        res.status(403);
        throw new Error("It's not Bearer token");
      }

      if (token) {
        // Розшифровуємо токен
        const decoded = jwt.verify(token, "pizza");
        const roles = decoded.roles;
        let hasRole = false;
        roles.forEach((role) => {
          if (rolesArr.includes(role)) {
            hasRole = true;
          }
        });

        if (!hasRole) {
          res.status(403);
          throw new Error("Forbidden");
        }

        next();
      }
    } catch (error) {
      res.status(403).json({ code: 403, message: error.message });
    }
  };
};
