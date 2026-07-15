export type ToastType = 'success' | 'error';

export interface ToastEventDetail {
  id: number;
  message: string;
  type: ToastType;
}

let counter = 0;

function emit(message: string, type: ToastType) {
  if (typeof window === 'undefined') return;
  counter += 1;
  window.dispatchEvent(
    new CustomEvent<ToastEventDetail>('xceed-toast', {
      detail: { id: counter, message, type },
    })
  );
}

export const toast = {
  success: (message: string) => emit(message, 'success'),
  error: (message: string) => emit(message, 'error'),
};
