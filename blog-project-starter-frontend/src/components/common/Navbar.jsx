import React from 'react';
import "./Navbar.css";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Navbar() {
    const navigate = useNavigate();
    const { currentUser, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <div className='py-5 flex justify-between items-center'>
            <h2 className='text-2xl font-bold'>Personal</h2>

            <div className='flex items-center'>
                {currentUser && (
                    <>
                        <Link className='list-none px-5' to="/home">
                            Home
                        </Link>

                        <Link className='list-none px-5' to="/blogs">
                            Blogs
                        </Link>

                        <Link className='list-none px-5' to="/about">
                            About
                        </Link>

                        <button
                            className='button-style hidden md:block'
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </>
                )}

                {!currentUser && (
                    <button
                        className='button-style hidden md:block'
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </button>
                )}
            </div>
        </div>
    );
}

export default Navbar;