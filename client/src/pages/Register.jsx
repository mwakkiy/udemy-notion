import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Link, useNavigate } from "react-router-dom";
import authApi from "../api/authApi";

function Register() {
  const navigate = useNavigate();

  const [usernameErrText, setUsernameErrText] = useState("");
  const [passwordErrText, setPasswordErrText] = useState("");
  const [confirmPasswordrrText, setConfirmPasswordErrText] = useState("");
  const [loadin, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();

    setUsernameErrText("");
    setPasswordErrText("");
    setConfirmPasswordErrText("");

    //入力欄の文字列を取得
    const data = new FormData(e.target);
    const username = data.get("username").trim();
    const password = data.get("password").trim();
    const confirmPassword = data.get("confirmPassword").trim();
    console.log(username);
    console.log(password);
    console.log(confirmPassword);

    let error = false;

    if (username === "") {
      setUsernameErrText("名前を入力してください");
      error = true;
    }
    // if (username.length <= 8) {
    //   setUsernameErrText("名前を8文字以上で入力してください");
    //   error = true;
    // }
    if (password === "") {
      setPasswordErrText("パスワードを入力してください");
      error = true;
    }
    if (confirmPassword === "") {
      setConfirmPasswordErrText("確認用パスワードを入力してください");
      error = true;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordErrText("パスワードと確認用パスワードが異なります");
      error = true;
    }

    if (error) {
      return;
    }

    setLoading(true);

    // 新規作成APIを叩く
    try {
      const res = await authApi.register({
        username,
        password,
        confirmPassword
      });
      setLoading(false);
      localStorage.setItem("token", res.token);
      console.log("新規登録に成功");
      navigate("/");
    } catch (err) {
      console.log(err);
      const errors = err.data.errors;
      errors.forEach(err => {
        if (err.param === "username") {
          setUsernameErrText(err.msg);
        }
        if (err.param === "password") {
          setPasswordErrText(err.msg);
        }
        if (err.param === "confirmPassword") {
          setConfirmPasswordErrText(err.msg);
        }
      });
      setLoading(false);
    }
  };
  return (
    <>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          fullWidth
          id="username"
          label="お名前"
          margin="normal"
          name="username"
          required
          helperText={usernameErrText}
          error={usernameErrText !== ""}
          disabled={loadin}
        />
        <TextField
          fullWidth
          id="password"
          label="パスワード"
          margin="normal"
          name="password"
          type="password"
          required
          helperText={passwordErrText}
          error={passwordErrText !== ""}
          disabled={loadin}
        />
        <TextField
          fullWidth
          id="confirmPassword"
          label="確認用パスワード"
          margin="normal"
          name="confirmPassword"
          type="password"
          required
          helperText={confirmPasswordrrText}
          error={confirmPasswordrrText !== ""}
          disabled={loadin}
        />
        <LoadingButton
          sx={{ mt: 3, mb: 2 }}
          fullWidth
          type="submit"
          loading={loadin}
          color="primary"
          variant="outlined"
        >
          アカウント作成
        </LoadingButton>
      </Box>
      <Button component={Link} to="/login">
        既にアカウントを持っていますか？ログイン
      </Button>
    </>
  );
}

export default Register;
