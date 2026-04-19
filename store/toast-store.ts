import { create } from 'zustand';

export type ToastTone = 'success' | 'error' | 'info';

export type ToastInput = {
  title: string;
  message?: string;
  tone?: ToastTone;
  durationMs?: number;
};

export type ToastItem = {
  id: string;
  title: string;
  message?: string;
  tone: ToastTone;
};

type ToastState = {
  toasts: ToastItem[];
  showToast: (input: ToastInput) => string;
  dismissToast: (id: string) => void;
  clearToasts: () => void;
};

const DEFAULT_DURATION_MS = 3200;
const MAX_TOASTS = 3;
const activeTimers = new Map<string, ReturnType<typeof setTimeout>>();
let nextToastId = 0;

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  showToast: ({ title, message, tone = 'info', durationMs = DEFAULT_DURATION_MS }) => {
    const id = `toast-${Date.now()}-${nextToastId++}`;

    set((state) => {
      const nextToasts = [{ id, title, message, tone }, ...state.toasts].slice(0, MAX_TOASTS);
      const keptToastIds = new Set(nextToasts.map((toast) => toast.id));

      for (const toast of state.toasts) {
        if (!keptToastIds.has(toast.id)) {
          const timer = activeTimers.get(toast.id);

          if (timer) {
            clearTimeout(timer);
            activeTimers.delete(toast.id);
          }
        }
      }

      return { toasts: nextToasts };
    });

    const timer = setTimeout(() => {
      get().dismissToast(id);
    }, durationMs);

    activeTimers.set(id, timer);

    return id;
  },
  dismissToast: (id) => {
    const timer = activeTimers.get(id);

    if (timer) {
      clearTimeout(timer);
      activeTimers.delete(id);
    }

    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
  clearToasts: () => {
    for (const timer of activeTimers.values()) {
      clearTimeout(timer);
    }

    activeTimers.clear();
    set({ toasts: [] });
  },
}));

export function showToast(input: ToastInput) {
  return useToastStore.getState().showToast(input);
}

export function showSuccessToast(input: Omit<ToastInput, 'tone'>) {
  return showToast({ ...input, tone: 'success' });
}

export function showErrorToast(input: Omit<ToastInput, 'tone'>) {
  return showToast({ ...input, tone: 'error' });
}

export function showInfoToast(input: Omit<ToastInput, 'tone'>) {
  return showToast({ ...input, tone: 'info' });
}
