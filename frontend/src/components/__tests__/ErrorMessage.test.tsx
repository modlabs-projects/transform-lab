import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../test/test-utils';
import ErrorMessage from '../ErrorMessage';
import userEvent from '@testing-library/user-event';

describe('ErrorMessage Component', () => {
  it('should render error message', () => {
    render(<ErrorMessage message="Test error message" />);
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('should render error icon', () => {
    render(<ErrorMessage message="Test error" />);
    expect(screen.getByText('⚠️')).toBeInTheDocument();
  });

  it('should render retry button when onRetry is provided', () => {
    const mockRetry = vi.fn();
    render(<ErrorMessage message="Test error" onRetry={mockRetry} />);
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('should not render retry button when onRetry is not provided', () => {
    render(<ErrorMessage message="Test error" />);
    expect(screen.queryByText('Try Again')).not.toBeInTheDocument();
  });

  it('should call onRetry when retry button is clicked', async () => {
    const user = userEvent.setup();
    const mockRetry = vi.fn();
    render(<ErrorMessage message="Test error" onRetry={mockRetry} />);
    
    const retryButton = screen.getByText('Try Again');
    await user.click(retryButton);
    
    expect(mockRetry).toHaveBeenCalledTimes(1);
  });
});
