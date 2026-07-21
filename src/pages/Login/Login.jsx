import { useState } from "react";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import FormField from "../../components/ui/FormField";

import {
  validateEmail,
  validatePassword,
} from "../../utils/validation";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleLogin = () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    setErrors({
      email: emailError,
      password: passwordError,
    });

    if (emailError || passwordError) {
      return;
    }

    console.log({
      email,
      password,
    });
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

          <Button
            size="large"
            onClick={handleLogin}
          >
            Login
          </Button>

          <p className="login-footer">
            Don't have an account?{" "}
            <a href="/register">Register</a>
          </p>
        </div>
      </Card>
    </div>
  );
}

export default Login;