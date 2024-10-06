import React from 'react';
import { NavLink,useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext'; // Import useAuth hook
import './navbar.css';

const NavBar = () => {
    const navigate = useNavigate(); // Initialize the navigate function
    const { logout } = useAuth(); // Access the logout function from AuthContext

    const handleLogout = () => {
        logout(); // Call the logout function
       // localStorage.setItem('username', loginData.UserName);
        navigate('/'); // Navigate to the home page after logging out
    };
   const username =localStorage.getItem('username')
    return (
        <nav>
            <ul>
            <li>
                    <NavLink 
                        to="/Home" 
                        className={({ isActive }) => (isActive ? "active-link" : undefined)}
                    >
                        Home
                    </NavLink>
                </li>
                <li>
                    <NavLink 
                        to="/EmpList" 
                        className={({ isActive }) => (isActive ? "active-link" : undefined)}
                    >
                        Employee List
                    </NavLink>
                </li>
                <li>
                  {username ? (
                      <span className="username-display">{username}</span>
                 ) : (
                     <NavLink 
                        to="/login" 
                        className={({ isActive }) => (isActive ? "active-link" : undefined)}
                    >
                    Login
               </NavLink>
                )}
               </li>

                <li>
                    <a href="/" onClick={handleLogout} className="logout-link">
                        Logout
                    </a>
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;
