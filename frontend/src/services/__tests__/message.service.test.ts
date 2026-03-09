import { describe, it, expect, vi, beforeEach } from 'vitest';
import { messageService } from '../message.service';
import apiClient from '../api.client';

// Mock the API client
vi.mock('../api.client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('Message Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllMessages', () => {
    it('should fetch all messages successfully', async () => {
      const mockMessages = [
        { id: 1, text: 'Test 1', summary: 'Summary 1', created: new Date().toISOString() },
        { id: 2, text: 'Test 2', summary: 'Summary 2', created: new Date().toISOString() },
      ];

      vi.mocked(apiClient.get).mockResolvedValue({
        data: {
          success: true,
          data: mockMessages,
          timestamp: new Date().toISOString(),
        },
      });

      const result = await messageService.getAllMessages();

      expect(apiClient.get).toHaveBeenCalledWith('/api/messages');
      expect(result).toEqual(mockMessages);
    });
  });

  describe('getMessageById', () => {
    it('should fetch a message by ID successfully', async () => {
      const mockMessage = { id: 1, text: 'Test', summary: 'Summary', created: new Date().toISOString() };

      vi.mocked(apiClient.get).mockResolvedValue({
        data: {
          success: true,
          data: mockMessage,
          timestamp: new Date().toISOString(),
        },
      });

      const result = await messageService.getMessageById(1);

      expect(apiClient.get).toHaveBeenCalledWith('/api/messages/1');
      expect(result).toEqual(mockMessage);
    });
  });

  describe('createMessage', () => {
    it('should create a message successfully', async () => {
      const newMessage = { text: 'New message', summary: 'New summary' };
      const createdMessage = { id: 1, ...newMessage, created: new Date().toISOString() };

      vi.mocked(apiClient.post).mockResolvedValue({
        data: {
          success: true,
          data: createdMessage,
          timestamp: new Date().toISOString(),
        },
      });

      const result = await messageService.createMessage(newMessage);

      expect(apiClient.post).toHaveBeenCalledWith('/api/messages', newMessage);
      expect(result).toEqual(createdMessage);
    });
  });

  describe('updateMessage', () => {
    it('should update a message successfully', async () => {
      const updateData = { text: 'Updated message', summary: 'Updated summary' };
      const updatedMessage = { id: 1, ...updateData, created: new Date().toISOString() };

      vi.mocked(apiClient.put).mockResolvedValue({
        data: {
          success: true,
          data: updatedMessage,
          timestamp: new Date().toISOString(),
        },
      });

      const result = await messageService.updateMessage(1, updateData);

      expect(apiClient.put).toHaveBeenCalledWith('/api/messages/1', updateData);
      expect(result).toEqual(updatedMessage);
    });
  });

  describe('deleteMessage', () => {
    it('should delete a message successfully', async () => {
      vi.mocked(apiClient.delete).mockResolvedValue({
        data: {
          success: true,
          timestamp: new Date().toISOString(),
        },
      });

      await messageService.deleteMessage(1);

      expect(apiClient.delete).toHaveBeenCalledWith('/api/messages/1');
    });
  });
});
