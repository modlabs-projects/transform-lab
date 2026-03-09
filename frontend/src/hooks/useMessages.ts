import { useState, useEffect } from 'react';
import { messageService } from '../services/message.service';
import type { Message } from '../types/message.types';

interface UseMessagesResult {
  messages: Message[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useMessages = (): UseMessagesResult => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await messageService.getAllMessages();
      setMessages(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to load messages';
      setError(errorMessage);
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return {
    messages,
    loading,
    error,
    refetch: fetchMessages,
  };
};
