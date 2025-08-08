// /src/components/layout/UserLayout.jsx

import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function UserLayout() {


  return (
    <div className="user-layout">
        <nav>
            <Navbar/>
        </nav>
        <Outlet />
    </div>
  );
}