import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Layout from '../components/Layout';
import { messageService } from '../services/message.service';
import type { MessageFormData } from '../types/message.types';
import '../styles/MessageForm.css';

const MessageForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<any[]>([]);
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<MessageFormData>();

  const isEditMode = Boolean(id);

  useEffect(() => {
    if (isEditMode && id) {
      loadMessage(parseInt(id));
    }
  }, [id, isEditMode]);

  const loadMessage = async (messageId: number) => {
    try {
      setLoading(true);
      const message = await messageService.getMessageById(messageId);
      setValue('text', message.text);
      setValue('summary', message.summary);
    } catch (err) {
      setError('Failed to load message');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: MessageFormData) => {
    try {
      setLoading(true);
      setError(null);
      setValidationErrors([]);

      if (isEditMode && id) {
        await messageService.updateMessage(parseInt(id), data);
        navigate(`/messages/${id}`, { state: { message: 'Successfully updated the message' } });
      } else {
        const newMessage = await messageService.createMessage(data);
        navigate(`/messages/${newMessage.id}`, { state: { message: 'Successfully created a new message' } });
      }
    } catch (err: any) {
      if (err.response?.data?.details) {
        setValidationErrors(err.response.data.details);
      } else {
        setError('Failed to save message');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout header={`Messages : ${isEditMode ? 'Edit' : 'Create'}`}>
      <form id="messageForm" onSubmit={handleSubmit(onSubmit)}>
        {validationErrors.length > 0 && (
          <div className="alert alert-error">
            {validationErrors.map((error, index) => (
              <p key={index}>{error.message}</p>
            ))}
          </div>
        )}

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="pull-right">
          <Link to="/">Messages</Link>
        </div>

        <div className="form-group">
          <label htmlFor="summary">Summary</label>
          <input
            type="text"
            id="summary"
            className={errors.summary ? 'field-error' : ''}
            {...register('summary', { required: 'Summary is required.' })}
          />
          {errors.summary && <span className="error-message">{errors.summary.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="text">Message</label>
          <textarea
            id="text"
            rows={5}
            className={errors.text ? 'field-error' : ''}
            {...register('text', { required: 'Message is required.' })}
          />
          {errors.text && <span className="error-message">{errors.text.message}</span>}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </Layout>
  );
};

export default MessageForm;
