import React, { useState, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import TicketDisplay from './TicketDisplay';
import './App.css';

function App() {
  const [events, setEvents] = useState([]);
  const [appError, setAppError] = useState('');
  const location = useLocation();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        console.log('Attempting to fetch events from Firestore...');
        const querySnapshot = await getDocs(collection(db, 'events'));
        console.log('Fetched events:', querySnapshot.docs.length);
        const eventsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEvents(eventsData);
      } catch (err) {
        console.error('Error fetching events from Firestore:', err);
        setAppError('Failed to fetch events: ' + err.message);
      }
    };

    fetchEvents();

    // Làm mới dữ liệu mỗi 30 giây
    const interval = setInterval(fetchEvents, 30000);

    return () => clearInterval(interval);
  }, []);

  if (appError) {
    return <div className="error">{appError}</div>;
  }

  return (
    <div className="App">
      <Routes>
        <Route path="/:eventId" element={<TicketDisplay events={events} />} />
        <Route path="/:eventId/:seatId" element={<TicketDisplay events={events} />} />
      </Routes>
    </div>
  );
}

export default App;