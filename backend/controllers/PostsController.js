const PostsModel = require("../models/postsModel");
const asyncHandler = require("express-async-handler");

class PostsController {
  //   add = async (req, res) => {
  //     const { title, author } = req.body;
  //     if (!title || !author) {
  //       res.status(400);
  //       res.json({ code: 400, message: "provide all required field" });
  //     }
  //     const post = await PostsModel.create({ ...req.body });
  //     res.status(201);
  //     res.json({ code: 201, message: "success", data: post });
  //   };

  add = asyncHandler(async (req, res) => {
    const { title, author } = req.body;
    if (!title || !author) {
      res.status(401);
      throw new Error("provide all required field");
    }
    const post = await PostsModel.create({ ...req.body });
    res.status(201);
    res.json({ code: 201, message: "success", data: post });
  });

  getAll = asyncHandler(async (req, res) => {
    const result = await PostsModel.find();
    res.status(200);
    res.json({
      code: 200,
      message: "success",
      data: result,
      qty: result.length,
    });
  });

  getOne = (req, res) => {
    res.send("getOne");
  };

  update = (req, res) => {
    res.send("update");
  };

  remove = (req, res) => {
    res.send("remove");
  };
}

module.exports = new PostsController();
