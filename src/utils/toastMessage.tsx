import { toast } from "react-toastify";

export const showSuccessToast = (message: string) => {
  toast.success(message, {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: true,
    closeButton: false,
    pauseOnHover: false,
    draggable: false,
    className: "center-toast success-toast",
  });
};

export const showErrorToast = (message: string) => {
  toast.error(message, {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: true,
    closeButton: false,
    pauseOnHover: false,
    draggable: false,
    className: "center-toast error-toast",
  });
};
