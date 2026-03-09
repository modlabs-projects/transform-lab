import apiClient from './api.client';
import type { Message, MessageFormData } from '../types/message.types';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export const messageService = {
  async getAllMessages(): Promise<Message[]> {
    const response = await apiClient.get<ApiResponse<Message[]>>('/api/messages');
    return response.data.data;
  },

  async getMessageById(id: number): Promise<Message> {
    const response = await apiClient.get<ApiResponse<Message>>(`/api/messages/${id}`);
    return response.data.data;
  },

  async createMessage(data: MessageFormData): Promise<Message> {
    const response = await apiClient.post<ApiResponse<Message>>('/api/messages', data);
    return response.data.data;
  },

  async updateMessage(id: number, data: MessageFormData): Promise<Message> {
    const response = await apiClient.put<ApiResponse<Message>>(`/api/messages/${id}`, data);
    return response.data.data;
  },

  async deleteMessage(id: number): Promise<void> {
    await apiClient.delete(`/api/messages/${id}`);
  },
};
