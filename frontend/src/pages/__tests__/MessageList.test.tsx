import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '../../test/test-utils';
import MessageList from '../MessageList';
import * as useMessagesHook from '../../hooks/useMessages';

// Mock the useMessages hook
vi.mock('../../hooks/useMessages');

describe('MessageList Component', () => {
  it('should display loading spinner when loading', () => {
    vi.mocked(useMessagesHook.useMessages).mockReturnValue({
      messages: [],
      loading: true,
      error: null,
      refetch: vi.fn(),
    });

    render(<MessageList />);

    expect(screen.getByText(/Loading messages.../i)).toBeInTheDocument();
  });

  it('should display error message when there is an error', () => {
    const mockRefetch = vi.fn();
    vi.mocked(useMessagesHook.useMessages).mockReturnValue({
      messages: [],
      loading: false,
      error: 'Failed to load messages',
      refetch: mockRefetch,
    });

    render(<MessageList />);

    expect(screen.getByText(/Failed to load messages/i)).toBeInTheDocument();
    expect(screen.getByText(/Try Again/i)).toBeInTheDocument();
  });

  it('should display "No messages" when message list is empty', () => {
    vi.mocked(useMessagesHook.useMessages).mockReturnValue({
      messages: [],
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<MessageList />);

    expect(screen.getByText(/No messages/i)).toBeInTheDocument();
  });

  it('should display list of messages', async () => {
    const mockMessages = [
      { id: 1, text: 'Message 1', summary: 'Summary 1', created: new Date('2024-01-01').toISOString() },
      { id: 2, text: 'Message 2', summary: 'Summary 2', created: new Date('2024-01-02').toISOString() },
    ];

    vi.mocked(useMessagesHook.useMessages).mockReturnValue({
      messages: mockMessages,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<MessageList />);

    await waitFor(() => {
      expect(screen.getByText('Summary 1')).toBeInTheDocument();
      expect(screen.getByText('Summary 2')).toBeInTheDocument();
    });
  });

  it('should display Create Message button', () => {
    vi.mocked(useMessagesHook.useMessages).mockReturnValue({
      messages: [],
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<MessageList />);

    expect(screen.getByText(/Create Message/i)).toBeInTheDocument();
  });

  it('should display table headers', () => {
    vi.mocked(useMessagesHook.useMessages).mockReturnValue({
      messages: [],
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<MessageList />);

    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Created')).toBeInTheDocument();
    expect(screen.getByText('Summary')).toBeInTheDocument();
  });
});
