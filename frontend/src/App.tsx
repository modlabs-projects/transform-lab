import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MessageList from './pages/MessageList';
import MessageForm from './pages/MessageForm';
import MessageView from './pages/MessageView';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MessageList />} />
        <Route path="/create" element={<MessageForm />} />
        <Route path="/messages/:id" element={<MessageView />} />
        <Route path="/modify/:id" element={<MessageForm />} />
      </Routes>
    </Router>
  );
}

export default App;
