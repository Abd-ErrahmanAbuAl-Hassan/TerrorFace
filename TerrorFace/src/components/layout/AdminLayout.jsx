// /src/components/layout/AdminLayout.jsx
import { Outlet ,Link} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faFire, faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import '../../styles/admin.css';

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <header className="admin-header">

        <nav className="admin-nav">
          <ul>
            <li>
              <Link to="/admin/dashboard">
                <FontAwesomeIcon icon={faShieldAlt} /> Dashboard
              </Link>
            </li>
            <li>
              <Link to="/admin/users">
                <FontAwesomeIcon icon={faFire} /> Users
              </Link>
            </li>
            <li>
              <Link to="/admin/posts">
                <FontAwesomeIcon icon={faFire} /> Posts
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}