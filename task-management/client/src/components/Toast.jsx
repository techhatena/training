import { CheckCircle, AlertCircle, Loader } from "lucide-react";
import { useEffect, useState } from "react";

export default function Toast({ type, message, onClose }) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (type === "loading") return;

    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onClose, 400);
    }, 3000); // Tăng từ 2000 lên 3000ms

    return () => clearTimeout(timer);
  }, [type, onClose]);

  const getStyles = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          icon: <CheckCircle size={24} className="text-green-600" />,
          text: "text-green-800",
        };
      case "error":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          icon: <AlertCircle size={24} className="text-red-600" />,
          text: "text-red-800",
        };
      case "loading":
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          icon: <Loader size={24} className="text-blue-600 animate-spin" />,
          text: "text-blue-800",
        };
      default:
        return {
          bg: "bg-gray-50",
          border: "border-gray-200",
          icon: null,
          text: "text-gray-800",
        };
    }
  };

  const styles = getStyles();

  return (
    <div
      className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[200] transition-all duration-500 ${
        isExiting ? "opacity-0 scale-95" : "opacity-100 scale-100"
      }`}
    >
      <div
        className={`flex items-center gap-4 px-6 py-4 rounded-lg border shadow-2xl ${styles.bg} ${styles.border}`}
      >
        {styles.icon}
        <span className={`font-medium text-lg ${styles.text}`}>{message}</span>
      </div>
    </div>
  );
}
