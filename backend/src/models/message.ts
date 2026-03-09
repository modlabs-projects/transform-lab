/*
 * Message model interface - migrated from Java Message entity
 *
 * Original Java entity fields:
 * - id (Long) -> number
 * - text (String, @NotEmpty) -> string
 * - summary (String, @NotEmpty) -> string
 * - created (Calendar) -> Date
 */

/**
 * Represents a Message entity in the system.
 * Maps to the Prisma Message model and the original Java Message class.
 */
export interface Message {
  /** Unique identifier for the message */
  id: number;
  /** The full text content of the message */
  text: string;
  /** A brief summary of the message */
  summary: string;
  /** Timestamp when the message was created */
  created: Date;
}

/**
 * Input type for creating a new message (id and created are auto-generated).
 */
export interface CreateMessageInput {
  text: string;
  summary: string;
}

/**
 * Input type for updating an existing message.
 */
export interface UpdateMessageInput {
  text: string;
  summary: string;
}
