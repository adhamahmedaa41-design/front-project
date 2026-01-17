// src/pages/verifyotp/resendOtp/ResendOtp.jsx
import { useState } from "react";
import { Button } from "react-bootstrap";
import toast from "react-hot-toast";
import { api } from "../../../api/api";              // ← this should work
import { errorHandler } from "../../../utlis/errorHandler";

export const ResendOTP = () => {
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(false);

  const handleResend = async () => {
    const email = localStorage.getItem("registeredEmail");

    if (!email) {
      toast.error("No email found. Please try registering again.");
      return;
    }

    if (cooldown) {
      toast("Please wait before requesting another OTP", { icon: "⏳" });
      return;
    }

    setLoading(true);
    setCooldown(true);

    try {
      const response = await api.post("/api/auth/resend-otp", { email });

      toast.success(
        response.data.message || "New OTP sent! Check your email.",
        { duration: 5000 }
      );

      setTimeout(() => setCooldown(false), 30 * 1000);
    } catch (error) {
      errorHandler(error);
      setCooldown(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline-success"
      onClick={handleResend}
      disabled={loading || cooldown}
      size="sm"
    >
      {loading ? "Sending..." : cooldown ? "Wait 30s..." : "Resend OTP"}
    </Button>
  );
};