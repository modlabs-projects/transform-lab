import { useState, useEffect } from 'react';
import { messageService } from '../services/message.service';
import type { Message } from '../types/message.types';

interface UseMessageResult {
  message: Message | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useMessage = (id: number | undefined): UseMessageResult => {
  const [message, setMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessage = async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await messageService.getMessageById(id);
      setMessage(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to load message';
      setError(errorMessage);
      console.error('Error fetching message:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessage();
  }, [id]);

  return {
    message,
    loading,
    error,
    refetch: fetchMessage,
  };
};
