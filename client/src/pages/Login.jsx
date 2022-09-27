import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Link, useNavigate } from "react-router-dom";
import authApi from "../api/authApi";

function Login() {
  const navigate = useNavigate();

  const [usernameErrText, setUsernameErrText] = useState("");
  const [passwordErrText, setPasswordErrText] = useState("");
  const [loadin, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();

    setUsernameErrText("");
    setPasswordErrText("");

    //入力欄の文字列を取得
    const data = new FormData(e.target);
    const username = data.get("username").trim();
    const password = data.get("password").trim();
    console.log(username);
    console.log(password);

    let error = false;

    if (username === "") {
      setUsernameErrText("名前を入力してください");
      error = true;
    }
    if (password === "") {
      setPasswordErrText("パスワードを入力してください");
      error = true;
    }
    if (error) {
      return;
    }

    setLoading(true);

    // 新規作成APIを叩く
    try {
      const res = await authApi.login({
        username,
        password
      });
      setLoading(false);
      localStorage.setItem("token", res.token);
      console.log("ログインに成功");
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

        <LoadingButton
          sx={{ mt: 3, mb: 2 }}
          fullWidth
          type="submit"
          loading={loadin}
          color="primary"
          variant="outlined"
        >
          ログイン
        </LoadingButton>
      </Box>
      <Button component={Link} to="/register">
        新規アカウント登録
      </Button>
    </>
  );
}

export default Login;
