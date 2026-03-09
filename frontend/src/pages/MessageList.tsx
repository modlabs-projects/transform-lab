import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useMessages } from '../hooks/useMessages';
import '../styles/MessageList.css';

const MessageList = () => {
  const { messages, loading, error, refetch } = useMessages();

  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    return d.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <Layout header="Messages : View all">
      <div className="pull-right">
        <Link to="/create" className="btn btn-primary">Create Message</Link>
      </div>
      
      {loading && <LoadingSpinner message="Loading messages..." />}
      
      {error && <ErrorMessage message={error} onRetry={refetch} />}
      
      {!loading && !error && (
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Created</th>
              <th>Summary</th>
            </tr>
          </thead>
          <tbody>
            {messages.length === 0 ? (
              <tr>
                <td colSpan={3}>No messages</td>
              </tr>
            ) : (
              messages.map((message) => (
                <tr key={message.id}>
                  <td>{message.id}</td>
                  <td>{formatDate(message.created)}</td>
                  <td>
                    <Link to={`/messages/${message.id}`}>
                      {message.summary}
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </Layout>
  );
};

export default MessageList;
