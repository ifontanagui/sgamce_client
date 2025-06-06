import { toast, ToastContainer } from "react-toastify";

export default function Toast() {
  return (
    <ToastContainer
      position="bottom-left"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss={false}
      draggable={false}
      pauseOnHover
      theme="colored"
    />
  )
}

export interface DispatchToastProps {
  type: 'success' | 'error'
  message: string
}

export function DispatchToast({ type, message }: DispatchToastProps) {
  if (!message) return;

  switch (type) {
    case "success":
      toast.success(message);
      break;
    case "error":
      toast.error(message);
      break;
  }
}