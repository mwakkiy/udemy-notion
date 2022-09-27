const router = require("express").Router();
const { body, validationResult } = require("express-validator");

require("dotenv").config();

const User = require("../modeles/user");
const validation = require("../handlers/validation");
const userController = require("../controller/user");
const tokenHandler = require("../handlers/tokenHandler");

// ユーザー新規登録API
// http://localhost:5000/api/v1/register
router.post(
  "/register",
  body("username")
    .isLength({ min: 8 })
    .withMessage("ユーザー名は8文字以上で入力"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("passwordは8文字以上で入力"),
  body("confirmPassword")
    .isLength({ min: 8 })
    .withMessage("password確認入力は8文字以上で入力"),
  body("username").custom(value => {
    return User.findOne({ username: value }).then(user => {
      if (user) {
        return Promise.reject("このユーザー名は既に使われています");
      }
    });
  }),
  validation.validat,
  userController.register
);

// ログインAPI
router.post(
  "/login",
  body("username")
    .isLength({ min: 8 })
    .withMessage("ユーザー名は8文字以上で入力"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("passwordは8文字以上で入力"),
  validation.validat,
  userController.login
);

// JWT認証API
router.post("/verify-token", tokenHandler.verifyToken, (req, res) => {
  return res.status(200).json({ user: req.user });
});

module.exports = router;
