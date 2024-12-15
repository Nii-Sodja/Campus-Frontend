import React, { useEffect, useState, useCallback } from 'react';
import NavBar from '../components/NavBar';
import EventCards from '../components/EventCards';
import EventCalendar from '../components/EventCalendar';
import Banner from '../components/Banner';
import api from '../middleware/api';

const Dashboard = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [view, setView] = useState('cards');
    const [selectedType, setSelectedType] = useState('all');

    // Sample events data
    const sampleEvents = [
        {
            name: 'FOOTBALL MATCH : VIKINGS VS DRAGONS',
            date: '2024-12-20',
            time: '2:00 PM',
            location: 'Football Pitch',
            type: 'sports',
            backgroundImage: '/img8.JPG'
        },
        {
            name: 'WORKSHOP : Webtech',
            date: '2024-12-25',
            time: '3:30 PM',
            location: 'Student Center Auditorium',
            type: 'technology',
            backgroundImage: '/img25.jpg'
        },
        {
            name: 'ARTS Club seminar',
            type: 'cultural',
            date: '2024-12-15',
            time: '6:00 PM',
            location: 'Campus Amphitheater',
            backgroundImage: '/img28.jpg'
        }
    ];

    const eventTypes = [
        'all',
        'sports',
        'academic',
        'social',
        'cultural',
        'technology'
    ];

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/api/events/getEvents');
            console.log('Fetched events:', response.data);
            
            if (response.data.length > 0) {
                setEvents(response.data);
                setFilteredEvents(response.data);
            } else {
                console.log('No events from API, using sample events');
                setEvents(sampleEvents);
                setFilteredEvents(sampleEvents);
            }
        } catch (error) {
            console.error('Error fetching events:', error);
            setError('Failed to fetch events. Showing sample events.');
            setEvents(sampleEvents);
            setFilteredEvents(sampleEvents);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    useEffect(() => {
        const filterEvents = () => {
            let filtered = [...events];

            if (searchTerm) {
                filtered = filtered.filter(event => 
                    event.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    event.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    event.location?.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            if (selectedType !== 'all') {
                filtered = filtered.filter(event => {
                    if (!event.type) return false;
                    return event.type.toLowerCase() === selectedType.toLowerCase();
                });
            }

            setFilteredEvents(filtered);
        };

        filterEvents();
    }, [events, searchTerm, selectedType]);

    return (
        <div className="min-h-screen bg-gray-50">
            <NavBar />
            <div className="max-w-7xl mx-auto p-6">
                <Banner 
                    backgroundImage='/img29.jpg'
                    title="Welcome"
                />
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <h1 className="text-2xl font-bold">Upcoming Events</h1>
                    <div className="flex flex-wrap gap-4 w-full sm:w-auto">
                        <input
                            type="text"
                            placeholder="Search events..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="p-2 border rounded flex-grow sm:flex-grow-0 sm:w-64"
                        />
                        <select 
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="p-2 border rounded"
                        >
                            {eventTypes.map(type => (
                                <option key={type} value={type}>
                                    {type === 'all' 
                                        ? 'All Events' 
                                        : type.charAt(0).toUpperCase() + type.slice(1)}
                                </option>
                            ))}
                        </select>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setView('cards')}
                                className={`px-4 py-2 rounded-lg ${
                                    view === 'cards' 
                                        ? 'bg-black text-white' 
                                        : 'bg-gray-200'
                                }`}
                            >
                                Cards
                            </button>
                            <button
                                onClick={() => setView('calendar')}
                                className={`px-4 py-2 rounded-lg ${
                                    view === 'calendar' 
                                        ? 'bg-black text-white' 
                                        : 'bg-gray-200'
                                }`}
                            >
                                Calendar
                            </button>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                    </div>
                ) : (
                    view === 'cards' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredEvents.length > 0 ? (
                                filteredEvents.map((event) => (
                                    <EventCards 
                                        key={event.id || event._id} 
                                        event={event} 
                                    />
                                ))
                            ) : (
                                <div className="col-span-full text-center text-gray-500 py-8">
                                    No events found matching your criteria
                                </div>
                            )}
                        </div>
                    ) : (
                        <EventCalendar 
                            events={filteredEvents}
                            selectedType={selectedType}
                        />
                    )
                )}
            </div>
        </div>
    );
};

export default Dashboard;