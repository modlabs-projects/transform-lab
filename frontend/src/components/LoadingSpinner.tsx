import '../styles/LoadingSpinner.css';

const LoadingSpinner = ({ message = 'Loading...' }: { message?: string }) => {
  return (
    <div className="loading-spinner-container">
      <div className="spinner"></div>
      <p className="loading-message">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
