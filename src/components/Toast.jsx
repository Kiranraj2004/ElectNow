// src/components/Toast.jsx
import React from "react";

const Toast = ({ message, type }) => {
  if (!message) return null;

  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";

  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg text-white text-center z-50 ${bgColor}`}
    >
      {message}
    </div>
  );
};

export default Toast;
