/*
 * Unit tests for MessageService
 * Tests all service methods with mocked MessageRepository.
 */

import { MessageService } from '../../src/services/messageService';
import { MessageRepository } from '../../src/repositories/messageRepository';
import { NotFoundError } from '../../src/utils/errors';
import { Message } from '../../src/models/message';

// Mock data
const mockMessage: Message = {
  id: 1,
  text: 'Test message',
  summary: 'Test summary',
  created: new Date('2024-01-15T10:30:00.000Z'),
};

const mockMessage2: Message = {
  id: 2,
  text: 'Second message',
  summary: 'Second summary',
  created: new Date('2024-01-15T11:00:00.000Z'),
};

describe('MessageService', () => {
  let messageService: MessageService;
  let mockMessageRepository: jest.Mocked<MessageRepository>;

  beforeEach(() => {
    mockMessageRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      save: jest.fn(),
      deleteMessage: jest.fn(),
    } as unknown as jest.Mocked<MessageRepository>;

    messageService = new MessageService(mockMessageRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllMessages', () => {
    it('should return all messages', async () => {
      mockMessageRepository.findAll.mockResolvedValue([mockMessage, mockMessage2]);

      const result = await messageService.getAllMessages();

      expect(result).toEqual([mockMessage, mockMessage2]);
      expect(mockMessageRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no messages exist', async () => {
      mockMessageRepository.findAll.mockResolvedValue([]);

      const result = await messageService.getAllMessages();

      expect(result).toEqual([]);
    });

    it('should propagate repository errors', async () => {
      mockMessageRepository.findAll.mockRejectedValue(new Error('Database error'));

      await expect(messageService.getAllMessages()).rejects.toThrow('Database error');
    });
  });

  describe('getMessageById', () => {
    it('should return message when found', async () => {
      mockMessageRepository.findById.mockResolvedValue(mockMessage);

      const result = await messageService.getMessageById(1);

      expect(result).toEqual(mockMessage);
      expect(mockMessageRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundError when message not found', async () => {
      mockMessageRepository.findById.mockResolvedValue(null);

      await expect(messageService.getMessageById(999)).rejects.toThrow(NotFoundError);
      await expect(messageService.getMessageById(999)).rejects.toThrow(
        'Message with id 999 not found'
      );
    });

    it('should propagate repository errors', async () => {
      mockMessageRepository.findById.mockRejectedValue(new Error('Database error'));

      await expect(messageService.getMessageById(1)).rejects.toThrow('Database error');
    });
  });

  describe('createMessage', () => {
    it('should create and return a new message', async () => {
      const newMessage: Message = {
        id: 3,
        text: 'New message',
        summary: 'New summary',
        created: new Date(),
      };
      mockMessageRepository.create.mockResolvedValue(newMessage);

      const result = await messageService.createMessage('New message', 'New summary');

      expect(result).toEqual(newMessage);
      expect(mockMessageRepository.create).toHaveBeenCalledWith({
        text: 'New message',
        summary: 'New summary',
      });
    });

    it('should propagate repository errors on create', async () => {
      mockMessageRepository.create.mockRejectedValue(new Error('Create failed'));

      await expect(
        messageService.createMessage('Test', 'Test')
      ).rejects.toThrow('Create failed');
    });
  });

  describe('updateMessage', () => {
    it('should update and return the message', async () => {
      const updatedMessage: Message = {
        id: 1,
        text: 'Updated text',
        summary: 'Updated summary',
        created: mockMessage.created,
      };
      mockMessageRepository.findById.mockResolvedValue(mockMessage);
      mockMessageRepository.update.mockResolvedValue(updatedMessage);

      const result = await messageService.updateMessage(1, 'Updated text', 'Updated summary');

      expect(result).toEqual(updatedMessage);
      expect(mockMessageRepository.findById).toHaveBeenCalledWith(1);
      expect(mockMessageRepository.update).toHaveBeenCalledWith(1, {
        text: 'Updated text',
        summary: 'Updated summary',
      });
    });

    it('should throw NotFoundError when updating non-existent message', async () => {
      mockMessageRepository.findById.mockResolvedValue(null);

      await expect(
        messageService.updateMessage(999, 'Test', 'Test')
      ).rejects.toThrow(NotFoundError);
      await expect(
        messageService.updateMessage(999, 'Test', 'Test')
      ).rejects.toThrow('Message with id 999 not found');
    });

    it('should not call update if message not found', async () => {
      mockMessageRepository.findById.mockResolvedValue(null);

      await expect(
        messageService.updateMessage(999, 'Test', 'Test')
      ).rejects.toThrow(NotFoundError);

      expect(mockMessageRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteMessage', () => {
    it('should delete the message', async () => {
      mockMessageRepository.findById.mockResolvedValue(mockMessage);
      mockMessageRepository.deleteMessage.mockResolvedValue(undefined);

      await messageService.deleteMessage(1);

      expect(mockMessageRepository.findById).toHaveBeenCalledWith(1);
      expect(mockMessageRepository.deleteMessage).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundError when deleting non-existent message', async () => {
      mockMessageRepository.findById.mockResolvedValue(null);

      await expect(messageService.deleteMessage(999)).rejects.toThrow(NotFoundError);
      await expect(messageService.deleteMessage(999)).rejects.toThrow(
        'Message with id 999 not found'
      );
    });

    it('should not call deleteMessage if message not found', async () => {
      mockMessageRepository.findById.mockResolvedValue(null);

      await expect(messageService.deleteMessage(999)).rejects.toThrow(NotFoundError);

      expect(mockMessageRepository.deleteMessage).not.toHaveBeenCalled();
    });

    it('should propagate repository errors on delete', async () => {
      mockMessageRepository.findById.mockResolvedValue(mockMessage);
      mockMessageRepository.deleteMessage.mockRejectedValue(new Error('Delete failed'));

      await expect(messageService.deleteMessage(1)).rejects.toThrow('Delete failed');
    });
  });
});
