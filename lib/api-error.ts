import axios from 'axios';

export function getErrorMessage(error: unknown, fallbackMessage: string) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;

    if (typeof message === 'string' && message.trim()) {
      return message;
    }

    if (Array.isArray(message) && message.length) {
      const firstMessage = message.find((item) => typeof item === 'string' && item.trim());

      if (firstMessage) {
        return firstMessage;
      }
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallbackMessage;
}
