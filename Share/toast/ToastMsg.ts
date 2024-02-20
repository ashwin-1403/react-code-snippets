import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const ToastSuccess = (msg: any) => {
  toast.success(msg, {
    hideProgressBar: true,
    autoClose: 4000,
  });
};

export const ToastFailure = (msg: any) => {
  toast.error(msg, {
    hideProgressBar: true,
    autoClose: 4000,
  });
};
