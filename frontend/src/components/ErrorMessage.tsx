import '../styles/ErrorMessage.css';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => {
  return (
    <div className="error-message-container">
      <div className="error-icon">⚠️</div>
      <p className="error-text">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="retry-button">
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
