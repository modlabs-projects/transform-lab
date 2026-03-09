/*
 * Message validation rules using express-validator.
 * Mirrors the Java validation annotations from Message.java:
 *   @NotEmpty(message = "Message is required.") private String text;
 *   @NotEmpty(message = "Summary is required.") private String summary;
 */

import { body } from 'express-validator';

/**
 * Validation chain for creating a new message.
 * Validates that both text and summary are non-empty strings.
 * Trim is applied first so whitespace-only strings are caught by notEmpty.
 */
export const createMessageValidation = [
  body('text')
    .isString()
    .withMessage('Message must be a string.')
    .trim()
    .notEmpty()
    .withMessage('Message is required.'),
  body('summary')
    .isString()
    .withMessage('Summary must be a string.')
    .trim()
    .notEmpty()
    .withMessage('Summary is required.'),
];

/**
 * Validation chain for updating an existing message.
 * Same validation rules as create.
 */
export const updateMessageValidation = [
  body('text')
    .isString()
    .withMessage('Message must be a string.')
    .trim()
    .notEmpty()
    .withMessage('Message is required.'),
  body('summary')
    .isString()
    .withMessage('Summary must be a string.')
    .trim()
    .notEmpty()
    .withMessage('Summary is required.'),
];
