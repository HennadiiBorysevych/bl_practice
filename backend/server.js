const express = require("express");
const bcrypt = require("bcryptjs");
const connectDB = require("../config/connectDB");
require("colors");
const path = require("path");
const configPath = path.join(__dirname, "..", "config", ".env");
require("dotenv").config({ path: configPath });
const asyncHandler = require("express-async-handler");
const errorHandler = require("./middlewares/errorHandler");
const authMiddleware = require("./middlewares/authMiddleware");
const userModel = require("./models/usersModel");
const rolesModel = require("./models/rolesModel");
const { log } = require("console");
const { generateKey } = require("crypto");
const jwt = require("jsonwebtoken");

const sendEmail = require("./services/sendEmail");

const { engine } = require("express-handlebars");
const app = express();

app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "backend/views");

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/about", (req, res) => {
  res.render("about");
});
app.get("/contact", (req, res) => {
  res.render("contact");
});
app.post("/send", async (req, res) => {
  try {
    await sendEmail(req.body);
    return res.render("send", {
      message: "Contact sent success",
      user: req.body.userName,
      email: req.body.userEmail,
    });
  } catch (error) {
    return res.status(400).json({ code: 400, message: error.message });
  }
});

// Реєстрація - зберігання користовувача в базі даних
app.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Отримуємо та вадлідуємо дані про користувача
    if (!email || !password) {
      res.status(400);
      throw new Error("provide all required field");
    }
    //   // Шукаємо користувача в БД
    const candidate = await userModel.findOne({ email });
    //   // Якщо знайшли, повідомаємо що користувач зареєстрований в БД
    if (candidate) {
      res.status(400);
      throw new Error("User allready exists");
    }
    //   // Якщо не знайшли - хешуємо пароль
    const hashPassword = bcrypt.hashSync(password, 5);
    const roles = await rolesModel.findOne({ value: "ADMIN" });
    //   // Зберігаємо користувача в БД
    const user = await userModel.create({
      ...req.body,
      password: hashPassword,
      roles: [roles.value],
    });

    res.status(201);
    res.json({ code: 201, message: "success", data: { email: user.email } });
  })
);

// Аутентифікація - перевірка даних користувача з даними, що збегаються в БД
app.post(
  "/login",
  asyncHandler(async (req, res) => {
    // Отримуємо та валідуємо дані
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("provide all required field");
    }
    // Шукаємо користувача в БД та розшифровуємо пароль
    const user = await userModel.findOne({ email });
    if (!user) {
      res.status(401);
      throw new Error("Invalid login or password");
    }

    // Якщо не знайшли або не розшифрувати пароль, пишемо "Invalid login or password"
    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) {
      res.status(401);
      throw new Error("Invalid login or password");
    }

    // Якщо все Ок, видаємо Token
    const token = generateToken({
      friends: ["Serhii", "Yana", "Yaroslav"],
      id: user._id,
      roles: user.roles,
    });
    // Зберагіємо користувача з токеном в базу
    user.token = token;
    await user.save();

    res.status(200);
    res.json({
      code: 200,
      message: "success",
      data: { email: user.email, token: user.token },
    });
  })
);

// Авторирзація - перевірка прав доступу користувача до БД
// Розлогування - вихід користувача з системи (втрата прав користувача)
app.get(
  "/logout",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const id = req.user;
    const user = await userModel.findById(id);
    user.token = null;
    await user.save();

    res.status(200).json({ message: "Logout success" });
  })
);

function generateToken(data) {
  const payload = { ...data };

  return jwt.sign(payload, "pizza", { expiresIn: "8h" });
}

app.use("/api/v1", require("./routes/postsRoutes"));

app.use(errorHandler);

connectDB();

app.listen(process.env.PORT, () => {
  console.log(`server is running on ${process.env.PORT}`.green.bold.italic);
});
