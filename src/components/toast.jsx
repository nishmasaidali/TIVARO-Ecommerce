
import { useEffect, useState } from "react";

import {
  CheckCircle,
  Heart,
  AlertCircle,
  Info,
  X,
  LogOut,
} from "lucide-react";

function Toast() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    function handleToast(event) {
      setToast({
        ...event.detail,
        id: Date.now(),
      });
    }

    window.addEventListener("tivaro-toast", handleToast);

    return () => {
      window.removeEventListener("tivaro-toast", handleToast);
    };
  }, []);

  useEffect(() => {
    if (!toast || toast.type === "confirm") return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast]);

  if (!toast) return null;

  const styles = {
    success: {
      icon: CheckCircle,
      color: "text-green-700",
      background: "bg-green-50",
      border: "border-green-200",
      title: "Success",
    },

    wishlist: {
      icon: Heart,
      color: "text-rose-600",
      background: "bg-rose-50",
      border: "border-rose-200",
      title: "Wishlist Updated",
    },

    error: {
      icon: AlertCircle,
      color: "text-red-600",
      background: "bg-red-50",
      border: "border-red-200",
      title: "Something Went Wrong",
    },

    info: {
      icon: Info,
      color: "text-[#A17D49]",
      background: "bg-[#F4EFE5]",
      border: "border-[#D8C9B5]",
      title: "Notification",
    },

    confirm: {
      icon: LogOut,
      color: "text-[#A17D49]",
      background: "bg-[#F4EFE5]",
      border: "border-[#D8C9B5]",
      title: "Confirm Logout",
    },
  };

  const style = styles[toast.type] || styles.success;
  const Icon = style.icon;

  return (
    <div
      key={toast.id}
      role={toast.type === "error" ? "alert" : "status"}
      aria-live={toast.type === "error" ? "assertive" : "polite"}
      className={`fixed right-5 top-5 z-[9999] flex w-[calc(100%-40px)] max-w-sm items-start gap-3 border p-4 shadow-lg ${style.background} ${style.border}`}
    >
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${style.color}`} />

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-[#30251E]">
          {toast.title || style.title}
        </p>

        <p className="mt-1 text-xs leading-5 text-[#766657]">
          {toast.message}
        </p>

        {toast.type === "confirm" && (
          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setToast(null)}
              className="border border-[#D9CBB7] px-4 py-2 text-xs text-[#30251E] transition hover:bg-[#E5D8C5]"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => {
                setToast(null);
                toast.onConfirm?.();
              }}
              className="bg-[#30251E] px-4 py-2 text-xs text-white transition hover:bg-[#A17D49]"
            >
              Yes, Logout
            </button>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => setToast(null)}
        className="text-[#766657] transition hover:text-[#30251E]"
        aria-label="Close notification"
      >
        <X size={17} />
      </button>
    </div>
  );
}

export default Toast;
