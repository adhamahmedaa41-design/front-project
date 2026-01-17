import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";
import { api } from "../../api/api";
import toast from "react-hot-toast";
import { errorHandler } from "../../utlis/errorHandler";

export default function ResetPassword() {
  const newPasswordRef = useRef();
  const confirmPasswordRef = useRef();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const { token } = useParams();

  // DEBUG: Log when component mounts
  useEffect(() => {
    console.log('🔄 ResetPassword Component Mounted');
    console.log('Token from useParams():', token);
    console.log('Full URL:', window.location.href);
    console.log('Hash:', window.location.hash);
    console.log('Pathname:', window.location.pathname);
    
    if (!token) {
      console.error('❌ NO TOKEN FOUND in useParams()!');
      toast.error('No reset token provided');
      navigate('/forgot-password');
    } else {
      console.log('✅ Token found:', token);
    }
  }, [token, navigate]);

  async function handleResetPassword(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    console.log('🔧 Handling password reset with token:', token);

    const newPassword = newPasswordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;

    if (!newPassword || !confirmPassword) {
      setError("Please fill in both password fields");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    try {
      console.log('📤 Sending reset request to backend...');
      const response = await api.post("/api/auth/reset-password", {
        token,
        newPassword,
      });

      console.log('✅ Reset successful:', response.data);
      toast.success(response.data.message || "Password reset successfully!");
      setSuccess("Your password has been reset. Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } catch (err) {
      console.error('❌ Reset failed:', err);
      const errorMsg =
        err.response?.data?.message ||
        "Failed to reset password. The link may be invalid or expired.";

      setError(errorMsg);
      toast.error(errorMsg);
      errorHandler(err);
    } finally {
      setLoading(false);
    }
  }

  console.log('🔄 ResetPassword rendering, token:', token);

  return (
    <div className="container mt-5" style={{ maxWidth: "450px" }}>
      <h1 className="text-center mb-4">Reset Your Password</h1>
      
      <Alert variant="info" className="mb-4">
        <strong>DEBUG INFO:</strong><br />
        Token from URL: <code>{token || 'NOT FOUND'}</code><br />
        Full URL: <small>{window.location.href}</small>
      </Alert>

      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
      {success && <Alert variant="success" className="mb-4">{success}</Alert>}

      {!success && (
        <>
          <p className="text-center text-muted mb-4">
            Please enter your new password
          </p>

          <Form onSubmit={handleResetPassword}>
            <Form.Group className="mb-4">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                ref={newPasswordRef}
                type="password"
                placeholder="Enter new password"
                disabled={loading}
                required
                minLength={8}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                ref={confirmPasswordRef}
                type="password"
                placeholder="Confirm new password"
                disabled={loading}
                required
                minLength={8}
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100"
              disabled={loading || !token}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </Form>
        </>
      )}
    </div>
  );
}