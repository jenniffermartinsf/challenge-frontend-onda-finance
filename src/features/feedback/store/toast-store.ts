import { create } from "zustand";

export type ToastVariant = "success" | "error" | "info";

export type ToastItem = {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
};

type ToastInput = Omit<ToastItem, "id">;

type ToastStore = {
  toasts: ToastItem[];
  addToast: (toast: ToastInput) => string;
  removeToast: (toastId: string) => void;
};

const toastTimeouts = new Map<string, number>();

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast(toast) {
    const id = crypto.randomUUID();

    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));

    const timeoutId = window.setTimeout(() => {
      useToastStore.getState().removeToast(id);
    }, 4000);

    toastTimeouts.set(id, timeoutId);

    return id;
  },
  removeToast(toastId) {
    const timeoutId = toastTimeouts.get(toastId);

    if (timeoutId) {
      window.clearTimeout(timeoutId);
      toastTimeouts.delete(toastId);
    }

    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== toastId),
    }));
  },
}));

export function showSuccessToast(title: string, description?: string) {
  useToastStore.getState().addToast({
    title,
    description,
    variant: "success",
  });
}

export function showErrorToast(title: string, description?: string) {
  useToastStore.getState().addToast({
    title,
    description,
    variant: "error",
  });
}

export function showInfoToast(title: string, description?: string) {
  useToastStore.getState().addToast({
    title,
    description,
    variant: "info",
  });
}

export function resetToastStore() {
  for (const timeoutId of toastTimeouts.values()) {
    window.clearTimeout(timeoutId);
  }

  toastTimeouts.clear();
  useToastStore.setState({
    toasts: [],
  });
}
