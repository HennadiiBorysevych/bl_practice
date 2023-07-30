// Cannot GET /api/v1/posts
const express = require("express");
const postsController = require("../controllers/PostsController");
const rolesMiddleware = require("../middlewares/rolesMiddleware");

const postsRoutes = express.Router();
// отримати всі
// додати пост
// отримати один
// обновити пост
// видалити
postsRoutes.get(
  "/posts",
  rolesMiddleware(["MODERATOR", "ADMIN", "CUSTOMER"]),
  postsController.getAll
);

// "USER", "MODERATOR", "COURIER",

postsRoutes.post(
  "/posts",
  (req, res, next) => {
    console.log("спрацював joi");
    next();
  },
  postsController.add
);
postsRoutes.get("/posts/:id", postsController.getOne);
postsRoutes.patch("/posts/:id", postsController.update);
postsRoutes.delete("/posts/:id", postsController.remove);

module.exports = postsRoutes;
