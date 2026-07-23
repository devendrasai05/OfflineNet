import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import FormField from "../../components/ui/FormField";

import {
  validateEmail,
  validatePassword,
} from "../../utils/validation";

import { registerUser } from "../../services/auth.service";

function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleRegister = async () => {
    const newErrors = {
      username: "",
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: "",
    };

    if (!username.trim()) {
      newErrors.username = "Username is required.";
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(
      (error) => error !== ""
    );

    if (hasErrors) {
      return;
    }

    try {
      const response = await registerUser({
        username,
        email,
        password,
      });

      alert(response.message);

      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="login-page">
      <Card className="login-card">
        <h1>OfflineNet</h1>
        <p>Create your account</p>

        <div className="login-form">
          <FormField
            label="Username"
            id="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);

              if (errors.username) {
                setErrors((prev) => ({
                  ...prev,
                  username: "",
                }));
              }
            }}
            error={errors.username}
          />

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

          <FormField
            label="Confirm Password"
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);

              if (errors.confirmPassword) {
                setErrors((prev) => ({
                  ...prev,
                  confirmPassword: "",
                }));
              }
            }}
            error={errors.confirmPassword}
          />

          <Button
            size="large"
            onClick={handleRegister}
          >
            Create Account
          </Button>

          <p className="login-footer">
            Already have an account?{" "}
            <a href="/login">Login</a>
          </p>
        </div>
      </Card>
    </div>
  );
}

export default Register;