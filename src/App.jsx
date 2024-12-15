import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import LoginPage from './pages/LoginPage'
import RsvpPage from './pages/RsvpPage'
import SignupPage from './pages/SignUpPage'
import PreferencesPage from './pages/PreferencesPage';
import AdminDashboard from './pages/AdminDashboard';
import MyEvents from './pages/MyEvents';
const App = () => {
  return (
    <>
    <Router>
    <Routes>
      <Route path='/' element={<Dashboard/>}></Route>
      <Route path='/login' element={<LoginPage/>}></Route>
      <Route path='/signup' element={<SignupPage/>}></Route>
      <Route path='/rsvp' element={<RsvpPage/>}></Route>
      <Route path="/preferences" element={<PreferencesPage />}></Route> 
      <Route path="/admin" element={<AdminDashboard/>}></Route>
      <Route path="/my-events" element={<MyEvents/>}></Route>
    </Routes>
    </Router>
    </>
  )
}

export default App