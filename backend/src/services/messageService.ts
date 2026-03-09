/*
 * MessageService - Service layer for Message business logic.
 * Migrated from the Spring Boot controller/service pattern.
 *
 * Uses constructor-based dependency injection of MessageRepository,
 * matching the original Spring Boot pattern:
 *   public MessageController(MessageRepository messageRepository) {
 *     this.messageRepository = messageRepository;
 *   }
 */

import { MessageRepository } from '../repositories/messageRepository';
import { Message } from '../models/message';
import { NotFoundError } from '../utils/errors';

/**
 * Service class for Message entity business logic.
 * All methods are async to support database operations via Prisma.
 */
export class MessageService {
  private messageRepository: MessageRepository;

  constructor(messageRepository: MessageRepository) {
    this.messageRepository = messageRepository;
  }

  /**
   * Retrieves all messages.
   * Equivalent to Java controller: list() -> messageRepository.findAll()
   * @returns Array of all messages
   */
  async getAllMessages(): Promise<Message[]> {
    return this.messageRepository.findAll();
  }

  /**
   * Retrieves a single message by its ID.
   * Equivalent to Java controller: view(@PathVariable("id") Message message)
   * Throws NotFoundError if the message does not exist.
   * @param id - The message ID
   * @returns The found message
   * @throws NotFoundError if no message exists with the given ID
   */
  async getMessageById(id: number): Promise<Message> {
    const message = await this.messageRepository.findById(id);
    if (!message) {
      throw new NotFoundError(`Message with id ${id} not found`);
    }
    return message;
  }

  /**
   * Creates a new message.
   * Equivalent to Java controller: create(@Valid Message message, ...)
   * The original saves with null id, which triggers auto-increment.
   * @param text - The message text content
   * @param summary - The message summary
   * @returns The created message with generated id and timestamp
   */
  async createMessage(text: string, summary: string): Promise<Message> {
    return this.messageRepository.create({ text, summary });
  }

  /**
   * Updates an existing message.
   * Equivalent to the modify flow in the original app.
   * Verifies the message exists before updating.
   * @param id - The ID of the message to update
   * @param text - The updated text content
   * @param summary - The updated summary
   * @returns The updated message
   * @throws NotFoundError if no message exists with the given ID
   */
  async updateMessage(id: number, text: string, summary: string): Promise<Message> {
    const existing = await this.messageRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Message with id ${id} not found`);
    }
    return this.messageRepository.update(id, { text, summary });
  }

  /**
   * Deletes a message by its ID.
   * Equivalent to Java controller: delete(@PathVariable("id") Long id)
   * @param id - The ID of the message to delete
   * @throws NotFoundError if no message exists with the given ID
   */
  async deleteMessage(id: number): Promise<void> {
    const existing = await this.messageRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Message with id ${id} not found`);
    }
    await this.messageRepository.deleteMessage(id);
  }
}
