import { Link } from 'react-router-dom';
import '../styles/Navigation.css';

const Navigation = () => {
  return (
    <div className="navbar">
      <div className="navbar-inner">
        <Link className="brand" to="/">
          Messages Application
        </Link>
        <ul className="nav">
          <li>
            <Link to="/">Messages</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navigation;
