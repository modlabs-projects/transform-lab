/*
 * MessageRepository - Prisma-based repository implementing the same operations
 * as the original Java MessageRepository interface and InMemoryMessageRepository.
 *
 * Original Java interface methods:
 * - Iterable<Message> findAll()
 * - Message save(Message message) -- create if no id, update if id exists
 * - Message findMessage(Long id)
 * - void deleteMessage(Long id)
 */

import { PrismaClient } from '@prisma/client';
import { Message, CreateMessageInput, UpdateMessageInput } from '../models/message';

/**
 * Repository class for Message entity using Prisma ORM.
 * Replicates the behavior of the original InMemoryMessageRepository.
 */
export class MessageRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Retrieves all messages from the database.
   * Equivalent to Java: Iterable<Message> findAll()
   */
  async findAll(): Promise<Message[]> {
    return this.prisma.message.findMany({
      orderBy: { created: 'desc' },
    });
  }

  /**
   * Finds a message by its unique identifier.
   * Equivalent to Java: Message findMessage(Long id)
   * @param id - The message ID to look up
   * @returns The message if found, null otherwise
   */
  async findById(id: number): Promise<Message | null> {
    return this.prisma.message.findUnique({
      where: { id },
    });
  }

  /**
   * Creates a new message in the database.
   * Used when the message has no ID (new message).
   * @param data - The message data to create
   * @returns The created message with generated id and created timestamp
   */
  async create(data: CreateMessageInput): Promise<Message> {
    return this.prisma.message.create({
      data: {
        text: data.text,
        summary: data.summary,
      },
    });
  }

  /**
   * Updates an existing message in the database.
   * Used when the message has an ID (existing message).
   * @param id - The ID of the message to update
   * @param data - The updated message data
   * @returns The updated message
   */
  async update(id: number, data: UpdateMessageInput): Promise<Message> {
    return this.prisma.message.update({
      where: { id },
      data: {
        text: data.text,
        summary: data.summary,
      },
    });
  }

  /**
   * Saves a message - creates if no id, updates if id exists.
   * Replicates the original InMemoryMessageRepository.save() behavior:
   *   if (id == null) { id = counter.incrementAndGet(); message.setId(id); }
   *   this.messages.put(id, message);
   * @param message - The message to save (partial, with optional id)
   * @returns The saved message
   */
  async save(message: Partial<Message> & CreateMessageInput): Promise<Message> {
    if (message.id) {
      return this.update(message.id, {
        text: message.text,
        summary: message.summary,
      });
    }
    return this.create({
      text: message.text,
      summary: message.summary,
    });
  }

  /**
   * Deletes a message by its unique identifier.
   * Equivalent to Java: void deleteMessage(Long id)
   * @param id - The ID of the message to delete
   */
  async deleteMessage(id: number): Promise<void> {
    await this.prisma.message.delete({
      where: { id },
    });
  }
}
