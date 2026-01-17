// src/pages/Login/Login.jsx
import { useState, useRef } from "react";
import { Form, Button, Alert, InputGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { api } from "../../api/api";
import { setUser } from "../../store/slices/userSlice";
import toast from "react-hot-toast";
import { errorHandler } from "../../utlis/errorHandler";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await api.post("/api/auth/login", {
        email: emailRef.current.value.trim(),
        password: passwordRef.current.value,
      });

      localStorage.setItem("token", data.token);
      dispatch(setUser(data.user || { email: data.email, role: "user" }));

      toast.success(data.message || "Login successful!");
      navigate("/");
    } catch (err) {
      // Handle unverified account case
      if (err.response?.data?.isVerified === false) {
        localStorage.setItem("email", err.response.data.email || emailRef.current.value.trim());
        toast.error("Please verify your email first");
        navigate("/verify-otp");
        return;
      }

      errorHandler(err);
      const errorMsg = err.response?.data?.message || "Login failed. Please try again.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "450px" }}>
      <h1 className="text-center mb-4">Login</h1>

      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

      <Form onSubmit={handleLogin}>
        <Form.Group className="mb-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="name@example.com"
            ref={emailRef}
            required
            disabled={loading}
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Password</Form.Label>
          <InputGroup>
            <Form.Control
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              ref={passwordRef}
              required
              disabled={loading}
            />
            <InputGroup.Text
              style={{ cursor: "pointer" }}
              onClick={togglePasswordVisibility}
              disabled={loading}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </InputGroup.Text>
          </InputGroup>
        </Form.Group>

        <div className="d-flex flex-column gap-3 mb-4">
          <Link to="/register" className="text-center">
            Don't have an account? <strong>Register</strong>
          </Link>

          <Link to="/forgot-password" className="text-center">
            Forgot Password?
          </Link>
        </div>

        <Button
          variant="primary"
          type="submit"
          className="w-100"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
      </Form>
    </div>
  );
}