import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../middleware/api';

const RsvpPage = () => {
  const [event, setEvent] = useState({});
  const [isRsvped, setIsRsvped] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const event = JSON.parse(localStorage.getItem('Event'));
    if (event) {
      setEvent(event);
      checkRsvpStatus(event._id);
    }
  }, []);

  const checkRsvpStatus = async (eventId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(`/api/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const userId = JSON.parse(localStorage.getItem('User'))._id;
      setIsRsvped(response.data.attendees.includes(userId));
    } catch (error) {
      console.error('Error checking RSVP status:', error);
    }
  };

  const handleRSVP = async () => {
    try {
        const token = JSON.parse(localStorage.getItem('User'))?.token;
        const userId = JSON.parse(localStorage.getItem('User'))?._id;
        
        console.log('RSVP attempt:', {
            eventId: event._id,
            userId: userId,
            token: token ? 'Token exists' : 'No token'
        });
        
        if (!token) {
            alert('Please login to RSVP');
            navigate('/login');
            return;
        }
        
        const response = await api.post(
            `/api/events/register/${event._id}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        console.log('RSVP response:', response.data);

        if (response.status === 200) {
            setIsRsvped(true);
            alert('Successfully RSVP\'d to event!');
        }
    } catch (error) {
        console.error('RSVP error details:', {
            message: error.response?.data?.message,
            details: error.response?.data?.details,
            status: error.response?.status
        });
        
        if (error.response?.status === 400) {
            alert(error.response.data.message);
        } else {
            alert('Error RSVP\'ing to event');
        }
    }
  };

  const handleCancelRSVP = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(
        `/api/events/unregister/${event._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.status === 200) {
        setIsRsvped(false);
        alert('Successfully cancelled RSVP');
      }
    } catch (error) {
      alert('Error cancelling RSVP');
    }
  };

  return (
    <div
      className="bg-cover bg-center min-h-screen text-white flex items-center justify-center"
      style={{ backgroundImage: `url(${event.backgroundImage})` }}
    >
      <div className="bg-black bg-opacity-50 backdrop-blur-md rounded-lg p-6 max-w-xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-6">Event Details</h1>
        <div className="text-lg space-y-4">
          <p>
            <span className="font-semibold">Date:</span> {new Date(event.date).toLocaleDateString()}
          </p>
          <p>
            <span className="font-semibold">Time:</span> {event.time}
          </p>
          <p>
            <span className="font-semibold">Location:</span> {event.location}
          </p>
          <p>
            <span className="font-semibold">Type:</span> {event.type}
          </p>
          {event.availableSeats !== undefined && (
            <p>
              <span className="font-semibold">Available Seats:</span> {event.availableSeats}
            </p>
          )}
        </div>
        <div className="flex justify-between mt-6 space-x-4">
          <button
            className="px-4 py-2 bg-blue-500 hover:bg-blue-700 rounded-lg text-white font-medium transition"
            onClick={() => navigate('/')}
          >
            Back to Dashboard
          </button>
          {!isRsvped ? (
            <button 
              className="px-4 py-2 bg-green-500 hover:bg-green-700 rounded-lg text-white font-medium transition"
              onClick={handleRSVP}
              disabled={event.availableSeats <= 0}
            >
              {event.availableSeats <= 0 ? 'Event Full' : 'Confirm RSVP'}
            </button>
          ) : (
            <button 
              className="px-4 py-2 bg-red-500 hover:bg-red-700 rounded-lg text-white font-medium transition"
              onClick={handleCancelRSVP}
            >
              Cancel RSVP
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RsvpPage;