import { toast } from 'react-toastify';
import type { ToastOptions } from 'react-toastify';

const defaultOpts: ToastOptions = { position: 'top-right', autoClose: 3000 };

export const showSuccess = (msg: string, opts?: ToastOptions) => toast.success(msg, { ...defaultOpts, ...opts });
export const showError = (msg: string, opts?: ToastOptions) => toast.error(msg, { ...defaultOpts, ...opts });
export const showInfo = (msg: string, opts?: ToastOptions) => toast.info(msg, { ...defaultOpts, ...opts });

export default { showSuccess, showError, showInfo };
