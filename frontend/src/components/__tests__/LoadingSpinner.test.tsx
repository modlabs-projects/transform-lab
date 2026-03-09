import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/test-utils';
import LoadingSpinner from '../LoadingSpinner';

describe('LoadingSpinner Component', () => {
  it('should render with default message', () => {
    render(<LoadingSpinner />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render with custom message', () => {
    render(<LoadingSpinner message="Loading messages..." />);
    expect(screen.getByText('Loading messages...')).toBeInTheDocument();
  });

  it('should render spinner element', () => {
    const { container } = render(<LoadingSpinner />);
    const spinner = container.querySelector('.spinner');
    expect(spinner).toBeInTheDocument();
  });
});
