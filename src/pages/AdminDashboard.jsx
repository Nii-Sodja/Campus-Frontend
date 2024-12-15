import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import axios from 'axios';
import api from '../middleware/api';
const AdminDashboard = () => {
    const navigate = useNavigate();
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState('');
    const [eventData, setEventData] = useState({
        name: '',
        date: '',
        time: '',
        location: '',
        type: '',
        capacity: '',
        description: '',
        backgroundImage: '/img29.jpg',
        venue: {
            building: '',
            room: '',
            address: ''
        },
        organizer: {
            name: '',
            email: '',
            phone: ''
        }
    });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('User'));
        if (!user || !user.email || !user.email.includes('@example.com') || !user.isAdmin) {
            navigate('/');
            return;
        }
    }, []);

    const validateForm = () => {
        if (!eventData.name.trim()) return 'Event name is required';
        if (!eventData.date) return 'Date is required';
        if (!eventData.time) return 'Time is required';
        if (!eventData.location.trim()) return 'Location is required';
        if (!eventData.type) return 'Event type is required';
        if (!eventData.capacity || eventData.capacity < 1) return 'Valid capacity is required';
        if (!eventData.description.trim()) return 'Description is required';
        
        const eventDate = new Date(eventData.date);
        if (eventDate < new Date().setHours(0, 0, 0, 0)) {
            return 'Event date cannot be in the past';
        }

        return null;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setEventData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setEventData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const formatTimeForSubmission = (time) => {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minutes} ${ampm}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const formattedData = {
                ...eventData,
                time: formatTimeForSubmission(eventData.time),
                capacity: parseInt(eventData.capacity)
            };

            await api.post(
                '/api/events/createEvent', 
                formattedData,
                { headers: { Authorization: `Bearer ${token}` }}
            );

            alert('Event created successfully!');
            navigate('/admin/events');
        } catch (error) {
            setError(error.response?.data?.message || 'Error creating event');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <NavBar />
            <div className="max-w-4xl mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Create New Event</h1>
                    <button
                        onClick={() => navigate('/admin/events')}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                        View All Events
                    </button>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow-md p-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Event Name*</label>
                            <input
                                type="text"
                                name="name"
                                value={eventData.name}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                maxLength="100"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Date*</label>
                            <input
                                type="date"
                                name="date"
                                value={eventData.date}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Time*</label>
                            <input
                                type="time"
                                name="time"
                                value={eventData.time}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Location*</label>
                            <input
                                type="text"
                                name="location"
                                value={eventData.location}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Type*</label>
                            <input
                                type="text"
                                name="type"
                                value={eventData.type}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Capacity*</label>
                            <input
                                type="number"
                                name="capacity"
                                value={eventData.capacity}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                min="1"
                                required
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium mb-1">Description*</label>
                            <textarea
                                name="description"
                                value={eventData.description}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                maxLength="1000"
                                required
                            />
                        </div>
                    </div>

                    {/* Venue Information */}
                    <div className="col-span-2">
                        <h3 className="text-lg font-medium mb-2">Venue Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Building</label>
                                <input
                                    type="text"
                                    name="venue.building"
                                    value={eventData.venue.building}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            {/* ... Additional venue fields ... */}
                        </div>
                    </div>

                    {/* Organizer Information */}
                    <div className="col-span-2">
                        <h3 className="text-lg font-medium mb-2">Organizer Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input
                                    type="text"
                                    name="organizer.name"
                                    value={eventData.organizer.name}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            {/* ... Additional organizer fields ... */}
                        </div>
                    </div>

                    <div className="flex gap-4 mt-6">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/events')}
                            className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`w-1/2 px-4 py-2 rounded-lg text-white ${
                                loading 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-black hover:bg-gray-800'
                            }`}
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create Event'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminDashboard;