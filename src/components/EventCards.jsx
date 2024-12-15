import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const EventCards = ({ event, onRsvpUpdate }) => {
    const navigate = useNavigate();
    const [isRsvped, setIsRsvped] = useState(false);
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);

    useEffect(() => {
        checkRsvpStatus();
    }, [event._id]);

    useEffect(() => {
        imageSetter();
    }, [event]);

    const imageSetter = () => {
        if (event?.name?.toLowerCase().includes('tech')) {
            setImage("img25.jpg");
        } else if (event?.name?.toLowerCase().includes('sports')) {
            setImage("img8.JPG");
        } else if (event?.name?.toLowerCase().includes('football')) {
            setImage("img8.JPG");
        } else if (event?.name?.toLowerCase().includes('arts')) {
            setImage("img6.JPG");
        }
    }

    const checkRsvpStatus = async () => {
        const user = JSON.parse(localStorage.getItem('User'));
        if (!user) return;

        try {
            const token = user.token;
            const response = await axios.get(`http://localhost:3000/api/events/${event._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const isUserRegistered = response.data.attendees?.includes(user._id);
            setIsRsvped(isUserRegistered);
            
            console.log('RSVP status check:', {
                eventId: event._id,
                isRegistered: isUserRegistered
            });
        } catch (error) {
            console.error('Error checking RSVP status:', error);
        }
    };

    const handleRSVP = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('User'));
            if (!user || !user.token || !user._id) {
                alert('Please login to RSVP');
                navigate('/login');
                return;
            }

            setLoading(true);

            const config = {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            };

            if (!isRsvped) {
                try {
                    const response = await axios.post(
                        `http://localhost:3000/api/events/register/${event._id}`,
                        {},
                        config
                    );
                    
                    console.log('RSVP success:', response.data);
                    setIsRsvped(true);
                    alert('Successfully RSVP\'d to event!');
                    
                    if (onRsvpUpdate) {
                        onRsvpUpdate();
                    }
                } catch (error) {
                    if (error.response?.data?.message === 'Already registered for this event') {
                        setIsRsvped(true);
                        alert('You are already registered for this event');
                    } else {
                        throw error;
                    }
                }
            } else {
                await axios.post(
                    `http://localhost:3000/api/events/unregister/${event._id}`,
                    {},
                    config
                );
                setIsRsvped(false);
                alert('Successfully cancelled RSVP');
                
                if (onRsvpUpdate) {
                    onRsvpUpdate();
                }
            }
        } catch (error) {
            console.error('RSVP error:', {
                status: error.response?.status,
                message: error.response?.data?.message,
                details: error.response?.data?.details,
                fullError: error.message
            });
            
            if (error.response?.status === 401) {
                alert('Your session has expired. Please login again.');
                localStorage.removeItem('User');
                navigate('/login');
                return;
            }
            
            alert(error.response?.data?.message || 'Error updating RSVP status');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform hover:scale-105">
            <div 
                className="h-48 bg-cover bg-center"
                style={{ backgroundImage: `url(${image})` }}
            />
            <div className="p-6">
                <div className="mb-4">
                    <h2 className="text-2xl font-bold mb-2 text-gray-800">{event.name}</h2>
                    <div className="space-y-2 text-gray-600">
                        <p className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(event.date).toLocaleDateString()}
                        </p>
                        <p className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {event.time}
                        </p>
                        <p className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {event.location}
                        </p>
                        {event.availableSeats !== undefined && (
                            <p className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Available Seats: {event.availableSeats}
                            </p>
                        )}
                    </div>
                </div>
                <button
                    onClick={handleRSVP}
                    disabled={loading || (!isRsvped && event.availableSeats <= 0)}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                        loading 
                            ? 'bg-gray-400 cursor-not-allowed'
                            : isRsvped
                                ? 'bg-red-500 hover:bg-red-600 text-white'
                                : event.availableSeats <= 0
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-black hover:bg-gray-800 text-white'
                    }`}
                >
                    {loading 
                        ? 'Processing...' 
                        : isRsvped 
                            ? 'Cancel RSVP' 
                            : event.availableSeats <= 0 
                                ? 'Event Full' 
                                : 'RSVP Now'
                    }
                </button>
            </div>
        </div>
    );
};

export default EventCards;