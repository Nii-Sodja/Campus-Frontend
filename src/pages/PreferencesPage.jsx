import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../middleware/api';
import NavBar from '../components/NavBar';

const PreferencesPage = () => {
    const navigate = useNavigate();
    const [preferences, setPreferences] = useState({
        sports: false,
        academic: false,
        social: false,
        cultural: false,
        technology: false
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPreferences = async () => {
            const user = JSON.parse(localStorage.getItem('User'));
            if (!user || !user.token) {
                navigate('/login');
                return;
            }

            try {
                const response = await api.get(
                    '/api/users/preferences',
                    {
                        headers: {
                            'Authorization': `Bearer ${user.token}`
                        }
                    }
                );

                if (response.data.preferences) {
                    setPreferences(response.data.preferences);
                }
            } catch (error) {
                console.error('Error fetching preferences:', error);
                setError('Failed to load preferences');
            } finally {
                setLoading(false);
            }
        };

        fetchPreferences();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const user = JSON.parse(localStorage.getItem('User'));
            if (!user || !user.token) {
                throw new Error('Please login to save preferences');
            }

            console.log('Sending preferences:', preferences);

            const response = await axios.post(
                'http://localhost:3000/api/users/preferences',
                preferences,
                {
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Server response:', response.data);

            // Update local storage with new preferences
            const updatedUser = {
                ...user,
                preferences: response.data.preferences || preferences
            };
            localStorage.setItem('User', JSON.stringify(updatedUser));

            alert('Preferences saved successfully!');
            navigate('/');
        } catch (error) {
            console.error('Error saving preferences:', {
                message: error.response?.data?.message,
                details: error.response?.data?.details,
                status: error.response?.status,
                fullError: error
            });

            if (error.response?.status === 401) {
                localStorage.removeItem('User');
                navigate('/login');
                return;
            }

            setError(
                error.response?.data?.message || 
                error.response?.data?.details || 
                'Failed to save preferences'
            );
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <NavBar />
                <div className="flex justify-center items-center h-[calc(100vh-64px)]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <NavBar />
            <div className="max-w-md mx-auto mt-10 bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold mb-6">Event Preferences</h2>
                <p className="text-gray-600 mb-6">
                    Select the types of events you're interested in. We'll prioritize showing you
                    these events.
                </p>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {Object.entries(preferences).map(([key, value]) => (
                        <div key={key} className="mb-4">
                            <label className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    checked={value}
                                    onChange={(e) => setPreferences(prev => ({
                                        ...prev,
                                        [key]: e.target.checked
                                    }))}
                                    className="form-checkbox h-5 w-5 text-black rounded"
                                />
                                <span className="text-gray-700 capitalize">
                                    {key} Events
                                </span>
                            </label>
                        </div>
                    ))}

                    <div className="flex justify-between mt-8">
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800"
                        >
                            Save Preferences
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PreferencesPage;