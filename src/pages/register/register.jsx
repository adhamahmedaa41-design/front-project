// src/pages/register/register.jsx
import { useRef, useState } from "react";
import { Form, Button, Alert, InputGroup } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { api } from "../../api/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Register() {
  const emailRef = useRef();
  const passwordRef = useRef();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  async function handleRegister(ev) {
    ev.preventDefault();

    const email = emailRef.current?.value?.trim();
    const password = passwordRef.current?.value;

    if (!email || !password) {
      const msg = "Please fill in all fields";
      setError(msg);
      toast.error(msg);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = { email, password };

      const response = await api.post("/api/auth/register", data);

      toast.success(response.data.message || "Registration successful! Check your email for OTP.", {
        duration: 5000,
      });

      setSuccess(true);

      // Save email for OTP page
      localStorage.setItem("registeredEmail", email);

      // Redirect to OTP verification
      setTimeout(() => {
        navigate("/verify-otp");
      }, 1500);

    } catch (error) {
      let errorMessage = "Registration failed. Please try again.";

      if (error.response) {
        const { status, data } = error.response;
        if (status === 400 && data.message === "Validation failed" && Array.isArray(data.errors)) {
          errorMessage = data.errors.join(" • ");
        } else if (data?.message) {
          errorMessage = data.message;
        } else if (status === 409) {
          errorMessage = "This email is already registered";
        } else if (status === 500) {
          errorMessage = "Server error. Please try again later.";
        }
      } else if (error.request) {
        errorMessage = "Cannot connect to server. Check your internet.";
      }

      setError(errorMessage);
      toast.error(errorMessage, { duration: 5000 });
    } finally {
      setLoading(false);
    }
  }

  function handleTogglePassword() {
    setShowPassword((prev) => !prev);
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "70vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5" style={{ maxWidth: "450px" }}>
      <h1 className="text-center mb-4">Register</h1>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">Registration successful! Check your email for OTP.</Alert>}

      <Form onSubmit={handleRegister}>
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
              placeholder="Password"
              ref={passwordRef}
              required
              disabled={loading}
            />
            <InputGroup.Text
              style={{ cursor: "pointer" }}
              onClick={handleTogglePassword}
              disabled={loading}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </InputGroup.Text>
          </InputGroup>
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100" disabled={loading}>
          Register
        </Button>
      </Form>
    </div>
  );
}

export default Register;