/*
 * Message Controller - Express Router for Message REST API endpoints.
 * Migrated from Spring Boot MessageController.java (Thymeleaf MVC) to JSON REST API.
 *
 * Original Spring Boot endpoint mappings:
 *   GET /         -> list all messages     -> GET /api/messages
 *   GET /{id}     -> view single message   -> GET /api/messages/:id
 *   POST /        -> create new message    -> POST /api/messages
 *   GET /delete/{id} -> delete message     -> DELETE /api/messages/:id
 *   GET /modify/{id} -> modify form        -> PUT /api/messages/:id
 */

import { Router, Request, Response, NextFunction } from 'express';
import { MessageService } from '../services/messageService';
import { MessageRepository } from '../repositories/messageRepository';
import { getPrismaClient } from '../config/database';
import { createMessageValidation, updateMessageValidation } from '../validators/messageValidator';
import { handleValidationErrors } from '../middleware/validationMiddleware';

const router = Router();

// Initialize dependencies
const prisma = getPrismaClient();
const messageRepository = new MessageRepository(prisma);
const messageService = new MessageService(messageRepository);

/**
 * GET /api/messages
 * List all messages.
 * Original: GET / -> ModelAndView("messages/list", "messages", messages)
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const messages = await messageService.getAllMessages();
    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/messages/:id
 * Get a single message by ID.
 * Original: GET /{id} -> ModelAndView("messages/view", "message", message)
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid message ID',
        statusCode: 400,
      });
      return;
    }
    const message = await messageService.getMessageById(id);
    res.status(200).json(message);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/messages
 * Create a new message.
 * Original: POST / with @Valid Message -> redirect to /{message.id}
 */
router.post(
  '/',
  createMessageValidation,
  handleValidationErrors,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { text, summary } = req.body;
      const message = await messageService.createMessage(text, summary);
      res.status(201).json(message);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PUT /api/messages/:id
 * Update an existing message.
 * Original: GET /modify/{id} -> form -> POST / (with existing id)
 */
router.put(
  '/:id',
  updateMessageValidation,
  handleValidationErrors,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        res.status(400).json({
          error: 'Bad Request',
          message: 'Invalid message ID',
          statusCode: 400,
        });
        return;
      }
      const { text, summary } = req.body;
      const message = await messageService.updateMessage(id, text, summary);
      res.status(200).json(message);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * DELETE /api/messages/:id
 * Delete a message.
 * Original: GET /delete/{id} -> messageRepository.deleteMessage(id) -> redirect to list
 */
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid message ID',
        statusCode: 400,
      });
      return;
    }
    await messageService.deleteMessage(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
