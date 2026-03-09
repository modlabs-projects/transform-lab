/*
 * Unit tests for MessageRepository
 * Tests all CRUD operations with a mocked PrismaClient.
 */

import { PrismaClient } from '@prisma/client';
import { MessageRepository } from '../../src/repositories/messageRepository';
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

describe('MessageRepository', () => {
  let messageRepository: MessageRepository;
  let mockPrisma: {
    message: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(() => {
    mockPrisma = {
      message: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };
    messageRepository = new MessageRepository(mockPrisma as unknown as PrismaClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return array of messages', async () => {
      mockPrisma.message.findMany.mockResolvedValue([mockMessage, mockMessage2]);

      const result = await messageRepository.findAll();

      expect(result).toEqual([mockMessage, mockMessage2]);
      expect(mockPrisma.message.findMany).toHaveBeenCalledWith({
        orderBy: { created: 'desc' },
      });
    });

    it('should return empty array when no messages exist', async () => {
      mockPrisma.message.findMany.mockResolvedValue([]);

      const result = await messageRepository.findAll();

      expect(result).toEqual([]);
      expect(mockPrisma.message.findMany).toHaveBeenCalledTimes(1);
    });

    it('should propagate database errors', async () => {
      const dbError = new Error('Database connection failed');
      mockPrisma.message.findMany.mockRejectedValue(dbError);

      await expect(messageRepository.findAll()).rejects.toThrow('Database connection failed');
    });
  });

  describe('findById', () => {
    it('should return message when found', async () => {
      mockPrisma.message.findUnique.mockResolvedValue(mockMessage);

      const result = await messageRepository.findById(1);

      expect(result).toEqual(mockMessage);
      expect(mockPrisma.message.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should return null when message not found', async () => {
      mockPrisma.message.findUnique.mockResolvedValue(null);

      const result = await messageRepository.findById(999);

      expect(result).toBeNull();
      expect(mockPrisma.message.findUnique).toHaveBeenCalledWith({
        where: { id: 999 },
      });
    });

    it('should propagate database errors', async () => {
      const dbError = new Error('Database query failed');
      mockPrisma.message.findUnique.mockRejectedValue(dbError);

      await expect(messageRepository.findById(1)).rejects.toThrow('Database query failed');
    });
  });

  describe('create', () => {
    it('should create and return a new message', async () => {
      const createInput = { text: 'New message', summary: 'New summary' };
      const createdMessage: Message = {
        id: 3,
        text: 'New message',
        summary: 'New summary',
        created: new Date('2024-01-15T12:00:00.000Z'),
      };
      mockPrisma.message.create.mockResolvedValue(createdMessage);

      const result = await messageRepository.create(createInput);

      expect(result).toEqual(createdMessage);
      expect(mockPrisma.message.create).toHaveBeenCalledWith({
        data: {
          text: 'New message',
          summary: 'New summary',
        },
      });
    });

    it('should propagate database errors on create', async () => {
      const dbError = new Error('Unique constraint violation');
      mockPrisma.message.create.mockRejectedValue(dbError);

      await expect(
        messageRepository.create({ text: 'Test', summary: 'Test' })
      ).rejects.toThrow('Unique constraint violation');
    });
  });

  describe('update', () => {
    it('should update and return the message', async () => {
      const updatedMessage: Message = {
        id: 1,
        text: 'Updated text',
        summary: 'Updated summary',
        created: mockMessage.created,
      };
      mockPrisma.message.update.mockResolvedValue(updatedMessage);

      const result = await messageRepository.update(1, {
        text: 'Updated text',
        summary: 'Updated summary',
      });

      expect(result).toEqual(updatedMessage);
      expect(mockPrisma.message.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          text: 'Updated text',
          summary: 'Updated summary',
        },
      });
    });

    it('should propagate errors when updating non-existent message', async () => {
      const dbError = new Error('Record not found');
      mockPrisma.message.update.mockRejectedValue(dbError);

      await expect(
        messageRepository.update(999, { text: 'Test', summary: 'Test' })
      ).rejects.toThrow('Record not found');
    });
  });

  describe('save', () => {
    it('should create new message when no id provided', async () => {
      const newMessage: Message = {
        id: 4,
        text: 'Save test',
        summary: 'Save summary',
        created: new Date(),
      };
      mockPrisma.message.create.mockResolvedValue(newMessage);

      const result = await messageRepository.save({
        text: 'Save test',
        summary: 'Save summary',
      });

      expect(result).toEqual(newMessage);
      expect(mockPrisma.message.create).toHaveBeenCalledWith({
        data: {
          text: 'Save test',
          summary: 'Save summary',
        },
      });
      expect(mockPrisma.message.update).not.toHaveBeenCalled();
    });

    it('should update existing message when id is provided', async () => {
      const updatedMessage: Message = {
        id: 1,
        text: 'Updated via save',
        summary: 'Updated summary via save',
        created: mockMessage.created,
      };
      mockPrisma.message.update.mockResolvedValue(updatedMessage);

      const result = await messageRepository.save({
        id: 1,
        text: 'Updated via save',
        summary: 'Updated summary via save',
      });

      expect(result).toEqual(updatedMessage);
      expect(mockPrisma.message.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          text: 'Updated via save',
          summary: 'Updated summary via save',
        },
      });
      expect(mockPrisma.message.create).not.toHaveBeenCalled();
    });
  });

  describe('deleteMessage', () => {
    it('should delete the message by id', async () => {
      mockPrisma.message.delete.mockResolvedValue(mockMessage);

      await messageRepository.deleteMessage(1);

      expect(mockPrisma.message.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should propagate errors when deleting non-existent message', async () => {
      const dbError = new Error('Record to delete not found');
      mockPrisma.message.delete.mockRejectedValue(dbError);

      await expect(messageRepository.deleteMessage(999)).rejects.toThrow(
        'Record to delete not found'
      );
    });
  });
});
