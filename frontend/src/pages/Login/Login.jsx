import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import FormField from "../../components/ui/FormField";

import {
  validateEmail,
  validatePassword,
} from "../../utils/validation";

import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../services/auth.service.js";
import { connectSocket } from "../../lib/socket";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    setErrors({
      email: emailError,
      password: passwordError,
    });

    if (emailError || passwordError) {
      return;
    }

    try {
      const response = await loginUser(email, password);

      localStorage.setItem(
        "offlinenet-token",
        response.token
      );

      connectSocket(response.token);

      login(response.user);

      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="login-page">
      <Card className="login-card">
        <h1>OfflineNet</h1>
        <p>Sign in to continue</p>

        <div className="login-form">
          <FormField
            label="Email"
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);

              if (errors.email) {
                setErrors((prev) => ({
                  ...prev,
                  email: "",
                }));
              }
            }}
            error={errors.email}
          />

          <FormField
            label="Password"
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);

              if (errors.password) {
                setErrors((prev) => ({
                  ...prev,
                  password: "",
                }));
              }
            }}
            error={errors.password}
          />

          <Button size="large" onClick={handleLogin}>
            Login
          </Button>

          <p className="login-footer">
            Don't have an account?{" "}
            <Link to="/register">Register</Link>
          </p>
        </div>
      </Card>
    </div>
  );
}

export default Login;