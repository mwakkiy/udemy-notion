const JWT = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const User = require("../modeles/user");

exports.register = async (req, res) => {
  // パスワードの受け取り
  const pasword = req.body.password;
  try {
    // 暗号化
    req.body.password = CryptoJS.AES.encrypt(pasword, process.env.SECRET_KEY);
    // ユーザー新規作成
    const user = await User.create(req.body);
    // console.log(user);

    // JWTの発行
    const token = JWT.sign({ id: user._id }, process.env.TOKEN_SECRET_KEY, {
      expiresIn: "24h"
    });
    // console.log(token);

    return res.status(200).json({ user, token });
  } catch (error) {
    return res.status(500).json(error);
  }
};

// ユーザーログインAPI
exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    // DBからユーザーが存在するか探してくる
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(401).json({
        errors: [
          {
            param: "username",
            msg: "ユーザー名が無効です"
          }
        ]
      });
    }

    // パスワードが合っているか照合する
    const descryptedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.SECRET_KEY
    ).toString(CryptoJS.enc.Utf8);
    if (descryptedPassword !== password) {
      return res.status(401).json({
        errors: [
          {
            param: "password",
            msg: "パスワードが無効です"
          }
        ]
      });
    }

    // JWTを発行
    const token = JWT.sign({ id: user._id }, process.env.TOKEN_SECRET_KEY, {
      expiresIn: "24h"
    });

    return res.status(201).json({ user, token });
  } catch (error) {
    return res.status(500).json(error);
  }
};
