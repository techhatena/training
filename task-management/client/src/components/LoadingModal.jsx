import { Loader, CheckCircle, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function LoadingModal({ message, type = "loading", onClose }) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (type === "loading") return;

    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        if (onClose) onClose();
      }, 300);
    }, 1500);

    return () => clearTimeout(timer);
  }, [type, onClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle size={48} className="text-green-600" />;
      case "error":
        return <X size={48} className="text-red-600" />;
      case "loading":
      default:
        return <Loader size={48} className="text-blue-600 animate-spin" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-50";
      case "error":
        return "bg-red-50";
      case "loading":
      default:
        return "bg-white";
    }
  };

  const getTextColor = () => {
    switch (type) {
      case "success":
        return "text-green-800";
      case "error":
        return "text-red-800";
      case "loading":
      default:
        return "text-gray-800";
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black/50 flex items-center justify-center z-[150] transition-opacity duration-300 ${
        isExiting ? "opacity-0" : "opacity-100"
      }`}
    >
      <div
        className={`${getStyles()} rounded-lg p-8 flex flex-col items-center gap-4 shadow-2xl transition-all duration-300 ${
          isExiting ? "scale-95" : "scale-100"
        }`}
      >
        {getIcon()}
        <p className={`text-lg font-semibold ${getTextColor()}`}>{message}</p>
      </div>
    </div>
  );
}
