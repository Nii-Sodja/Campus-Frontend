import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NavBar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('User'));

    const handleLogout = () => {
        localStorage.removeItem('User');
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="w-full px-4 flex justify-between items-center h-16">
                <div className="flex items-center gap-6">
                    <Link to="/" className="text-xl font-medium text-gray-600">
                        CampusXperience
                    </Link>
                    <div className="flex gap-6 text-gray-600 font-medium">
                        <Link
                            to="/my-events"
                            className="hover:text-black transition-colors"
                        >
                            My Events
                        </Link>
                        {user?.isAdmin && (
                            <Link
                                to="/admin"
                                className="hover:text-black transition-colors"
                            >
                                Admin
                            </Link>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <p className="text-gray-600">{`Hello ${user.name}`}</p>
                            <Link 
                                to="/preferences"
                                className="text-gray-600 hover:text-black px-4 py-2 rounded-lg hover:bg-gray-100"
                            >
                                Preferences
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800"
                            >
                                Log Out
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default NavBar;