// src/pages/verifyotp/verifyOtp.jsx
import { useRef, useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux"; // ← added
import { api } from "../../api/api";
import { errorHandler } from "../../utlis/errorHandler.js";
import { setUser } from "../../store/slices/userSlice"; // ← make sure path is correct!
import { ResendOTP } from "../verifyotp/resendOtp/resendOtp.jsx"; // ← added

export default function VerifyOtp() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const dispatch = useDispatch(); // ← added
  const navigate = useNavigate();
  const otpRef = useRef();

  async function handleVerifyOTP(e) {
    e.preventDefault();

    const otp = otpRef.current?.value?.trim();
    const email = localStorage.getItem("registeredEmail");

    if (!email) {
      toast.error("No registration email found. Please register again.");
      navigate("/register");
      return;
    }

    if (!otp || otp.length < 4) {
      setError("Please enter a valid OTP (at least 4 digits)");
      toast.error("Please enter a valid OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = { email, otp };

      console.log("→ Sending OTP verification request:", { email, otp });

      const response = await api.post("/api/auth/verify-otp", data);

      console.log("← Verification successful:", response.data);

      // Make sure token exists
      if (!response.data.token) {
        throw new Error("Server did not return a token");
      }

      // Save token
      localStorage.setItem("token", response.data.token);
      console.log("Token saved to localStorage successfully ✓");

      // Get user data from response
      const userData = response.data.user || {
        // fallback structure if backend doesn't return user object
        id: response.data.id,
        email: email,
        role: "user", // default fallback
        isVerified: true,
      };

      // Save user to Redux → this is what you wanted
      dispatch(setUser(userData));

      toast.success(response.data.message || "Email verified successfully!");
      setSuccess(true);

      // Redirect after short delay
      setTimeout(() => {
        navigate("/");
      }, 1800);
    } catch (error) {
      console.groupCollapsed("Verification failed");
      console.error(error);

      let msg = "Invalid or expired OTP";

      if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Message:", error.response.data?.message);
        msg = error.response.data?.message || msg;
      } else if (error.request) {
        msg = "Cannot connect to server. Is backend running?";
      }

      errorHandler(error);
      setError(msg);
      toast.error(msg);

      console.groupEnd();
    } finally {
      setLoading(false);
    }
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
      <h1 className="text-center mb-4">Verify OTP</h1>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">Email verified successfully! Redirecting...</Alert>}

      <Form onSubmit={handleVerifyOTP}>
        <Form.Group className="mb-4">
          <Form.Label htmlFor="otp-code">Enter OTP Code</Form.Label>
          <Form.Control
            type="text"
            id="otp-code"
            name="otp-code"
            placeholder="Enter OTP"
            maxLength={6}
            ref={otpRef}
            required
            disabled={loading}
          />
        </Form.Group>

        <div className="d-flex align-items-center gap-2">
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Verify"}
          </Button>
          <ResendOTP />
        </div>
      </Form>
    </div>
  );
}