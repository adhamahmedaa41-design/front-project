import toast from "react-hot-toast";

// Global Error Handler
export function errorHandler(error) {
  // Handle Error Messages []
  if (error.response?.data?.messages) {
    error.response?.data?.messages.forEach((message) => {
      toast.error(message);
    });
  }
  // Handle Error Message
  else if (error.response?.data?.message) {
    toast.error(error.response?.data?.message);
  }
  // Default Message
  else {
    toast.error("Something went wrong");
  }
}
