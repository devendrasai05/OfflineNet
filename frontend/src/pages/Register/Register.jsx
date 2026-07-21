import { useState } from "react";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import FormField from "../../components/ui/FormField";

import {
  validateEmail,
  validatePassword,
} from "../../utils/validation";

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleRegister = () => {
    const newErrors = {
      fullName: "",
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: "",
    };

    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required.";
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

    console.log({
      fullName,
      email,
      password,
      confirmPassword,
    });
  };

  return (
    <div className="login-page">
      <Card className="login-card">
        <h1>OfflineNet</h1>
        <p>Create your account</p>

        <div className="login-form">
          <FormField
            label="Full Name"
            id="fullName"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);

              if (errors.fullName) {
                setErrors((prev) => ({
                  ...prev,
                  fullName: "",
                }));
              }
            }}
            error={errors.fullName}
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
            Already have an account? <a href="/login">Login</a>
          </p>
        </div>
      </Card>
    </div>
  );
}

export default Register;