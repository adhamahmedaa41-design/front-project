// src/pages/forgot-password/forgot-password.jsx
import { useState, useRef } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import toast from "react-hot-toast";
import { errorHandler } from "../../utlis/errorHandler"; // ← fixed path if needed

export default function ForgotPassword() {
  const emailRef = useRef();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const email = emailRef.current.value.trim();

    if (!email) {
      setError("Please enter your email address");
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.post("/api/auth/forgot-password", { email });

      toast.success(data.message || "Reset link sent! Check your email.");

      // Development mode: if token is returned → go to reset page immediately
      if (data.token) {
        navigate(`/reset-password/${data.token}`);
        return;
      }

      // Normal behavior (production / staging)
      setMessage("Password reset link has been sent to your email (if account exists).");

      // Redirect to LOGIN - NOT to reset-password
      setTimeout(() => {
        navigate("/login");
      }, 4000);
    } catch (err) {
      errorHandler(err);

      const errorMsg =
        err.response?.data?.message ||
        "Something went wrong. Please try again later.";

      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mt-5" style={{ maxWidth: "450px" }}>
      <h1 className="text-center mb-4">Forgot Password</h1>

      {message && <Alert variant="success" className="mb-4">{message}</Alert>}
      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

      <p className="text-center text-muted mb-4">
        Enter your email address and we'll send you a link to reset your password.
      </p>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-4">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="name@example.com"
            ref={emailRef}
            required
            disabled={loading}
          />
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          className="w-100 mb-4"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </Button>

        <div className="text-center">
          <Link to="/login">Back to Login</Link>
        </div>
      </Form>
    </div>
  );
}