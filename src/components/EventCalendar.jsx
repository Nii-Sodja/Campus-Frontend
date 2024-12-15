import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useNavigate } from 'react-router-dom';

const localizer = momentLocalizer(moment);

const EventCalendar = ({ events, selectedType }) => {
    const navigate = useNavigate();

    // Format events for the calendar
    const calendarEvents = events.map(event => ({
        id: event._id,
        title: event.name,
        start: new Date(event.date),
        end: new Date(event.date),
        type: event.type,
        location: event.location,
        availableSeats: event.availableSeats
    }));

    // Filter events based on selected type
    const filteredEvents = selectedType === 'all' 
        ? calendarEvents 
        : calendarEvents.filter(event => event.type === selectedType);

    const eventStyleGetter = (event) => {
        let backgroundColor = '#000000';
        
        // Color-code events by type
        switch (event.type?.toLowerCase()) {
            case 'sports':
                backgroundColor = '#2563EB';
                break;
            case 'academic':
                backgroundColor = '#DC2626';
                break;
            case 'social':
                backgroundColor = '#059669';
                break;
            case 'cultural':
                backgroundColor = '#7C3AED';
                break;
            case 'technology':
                backgroundColor = '#EA580C';
                break;
            default:
                backgroundColor = '#000000';
        }

        return {
            style: {
                backgroundColor,
                borderRadius: '5px',
                opacity: 0.8,
                color: 'white',
                border: '0px',
                display: 'block'
            }
        };
    };

    const CustomEvent = ({ event }) => (
        <div className="p-1">
            <strong>{event.title}</strong>
            <div className="text-sm">{event.location}</div>
            <div className="text-sm">Available: {event.availableSeats}</div>
        </div>
    );

    const handleSelectEvent = (event) => {
        // Store event details in localStorage before navigation
        localStorage.setItem('Event', JSON.stringify({
            _id: event.id,
            name: event.title,
            date: event.start,
            location: event.location,
            type: event.type,
            availableSeats: event.availableSeats
        }));
        navigate('/rsvp');
    };

    return (
        <div className="h-[600px] bg-white rounded-lg shadow-md p-4">
            <Calendar
                localizer={localizer}
                events={filteredEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                eventPropGetter={eventStyleGetter}
                components={{
                    event: CustomEvent
                }}
                views={['month', 'week', 'day']}
                popup
                selectable
                onSelectEvent={handleSelectEvent}
            />
        </div>
    );
};

export default EventCalendar;