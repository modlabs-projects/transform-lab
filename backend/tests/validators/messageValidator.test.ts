/*
 * Unit tests for message validators.
 * Tests express-validator validation rules for text and summary fields.
 */

import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { createMessageValidation, updateMessageValidation } from '../../src/validators/messageValidator';

/**
 * Helper function to run express-validator validation chains against mock request data.
 */
async function runValidation(
  validations: any[],
  body: Record<string, any>
): Promise<{ errors: any[] }> {
  const req = {
    body,
    query: {},
    params: {},
    headers: {},
  } as unknown as Request;
  const res = {} as Response;
  const next: NextFunction = jest.fn();

  for (const validation of validations) {
    await validation.run(req);
  }

  const result = validationResult(req);
  return {
    errors: result.array(),
  };
}

describe('createMessageValidation', () => {
  it('should pass with valid text and summary', async () => {
    const { errors } = await runValidation(createMessageValidation, {
      text: 'Hello World',
      summary: 'A greeting',
    });

    expect(errors).toHaveLength(0);
  });

  it('should fail when text is empty', async () => {
    const { errors } = await runValidation(createMessageValidation, {
      text: '',
      summary: 'A summary',
    });

    const textErrors = errors.filter((e: any) => e.path === 'text');
    expect(textErrors.length).toBeGreaterThan(0);
    expect(textErrors[0].msg).toBe('Message is required.');
  });

  it('should fail when text is missing', async () => {
    const { errors } = await runValidation(createMessageValidation, {
      summary: 'A summary',
    });

    const textErrors = errors.filter((e: any) => e.path === 'text');
    expect(textErrors.length).toBeGreaterThan(0);
  });

  it('should fail when summary is empty', async () => {
    const { errors } = await runValidation(createMessageValidation, {
      text: 'Hello',
      summary: '',
    });

    const summaryErrors = errors.filter((e: any) => e.path === 'summary');
    expect(summaryErrors.length).toBeGreaterThan(0);
    expect(summaryErrors[0].msg).toBe('Summary is required.');
  });

  it('should fail when summary is missing', async () => {
    const { errors } = await runValidation(createMessageValidation, {
      text: 'Hello',
    });

    const summaryErrors = errors.filter((e: any) => e.path === 'summary');
    expect(summaryErrors.length).toBeGreaterThan(0);
  });

  it('should fail when both fields are empty', async () => {
    const { errors } = await runValidation(createMessageValidation, {
      text: '',
      summary: '',
    });

    expect(errors.length).toBeGreaterThanOrEqual(2);
  });

  it('should fail when both fields are missing', async () => {
    const { errors } = await runValidation(createMessageValidation, {});

    expect(errors.length).toBeGreaterThanOrEqual(2);
  });

  it('should trim whitespace-only text', async () => {
    const { errors } = await runValidation(createMessageValidation, {
      text: '   ',
      summary: 'Valid summary',
    });

    const textErrors = errors.filter((e: any) => e.path === 'text');
    expect(textErrors.length).toBeGreaterThan(0);
  });

  it('should trim whitespace-only summary', async () => {
    const { errors } = await runValidation(createMessageValidation, {
      text: 'Valid text',
      summary: '   ',
    });

    const summaryErrors = errors.filter((e: any) => e.path === 'summary');
    expect(summaryErrors.length).toBeGreaterThan(0);
  });
});

describe('updateMessageValidation', () => {
  it('should pass with valid text and summary', async () => {
    const { errors } = await runValidation(updateMessageValidation, {
      text: 'Updated text',
      summary: 'Updated summary',
    });

    expect(errors).toHaveLength(0);
  });

  it('should fail when text is empty', async () => {
    const { errors } = await runValidation(updateMessageValidation, {
      text: '',
      summary: 'Valid summary',
    });

    const textErrors = errors.filter((e: any) => e.path === 'text');
    expect(textErrors.length).toBeGreaterThan(0);
    expect(textErrors[0].msg).toBe('Message is required.');
  });

  it('should fail when summary is empty', async () => {
    const { errors } = await runValidation(updateMessageValidation, {
      text: 'Valid text',
      summary: '',
    });

    const summaryErrors = errors.filter((e: any) => e.path === 'summary');
    expect(summaryErrors.length).toBeGreaterThan(0);
    expect(summaryErrors[0].msg).toBe('Summary is required.');
  });

  it('should fail when both fields are missing', async () => {
    const { errors } = await runValidation(updateMessageValidation, {});

    expect(errors.length).toBeGreaterThanOrEqual(2);
  });
});
