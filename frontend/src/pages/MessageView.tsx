import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { messageService } from '../services/message.service';
import type { Message } from '../types/message.types';
import '../styles/MessageView.css';

const MessageView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [globalMessage, setGlobalMessage] = useState<string | null>(null);

  useEffect(() => {
    if (location.state?.message) {
      setGlobalMessage(location.state.message);
    }
  }, [location.state]);

  useEffect(() => {
    if (id) {
      loadMessage(parseInt(id));
    }
  }, [id]);

  const loadMessage = async (messageId: number) => {
    try {
      setLoading(true);
      const data = await messageService.getMessageById(messageId);
      setMessage(data);
      setError(null);
    } catch (err) {
      setError('Message not found');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!message?.id) return;

    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await messageService.deleteMessage(message.id);
        navigate('/');
      } catch (err) {
        setError('Failed to delete message');
        console.error(err);
      }
    }
  };

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
    <Layout header="Messages : View">
      {globalMessage && (
        <div className="alert alert-success">{globalMessage}</div>
      )}

      <div className="pull-right">
        <Link to="/">Messages</Link>
      </div>

      {loading && <div className="alert alert-info">Loading message...</div>}

      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && message && (
        <>
          <dl>
            <dt>ID</dt>
            <dd id="id">{message.id}</dd>
            <dt>Date</dt>
            <dd id="created">{formatDate(message.created)}</dd>
            <dt>Summary</dt>
            <dd id="summary">{message.summary}</dd>
            <dt>Message</dt>
            <dd id="text">{message.text}</dd>
          </dl>

          <div className="pull-left">
            <button onClick={handleDelete} className="btn btn-danger">
              delete
            </button>
            {' | '}
            <Link to={`/modify/${message.id}`}>modify</Link>
          </div>
        </>
      )}
    </Layout>
  );
};

export default MessageView;
