import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import ChatPage from './pages/ChatPage'
import GamesPage from './pages/GamesPage'
import MusicPage from './pages/MusicPage'
import WatchPage from './pages/WatchPage'
import MemoriesPage from './pages/MemoriesPage'
import DatesPage from './pages/DatesPage'
import DateNightPage from './pages/DateNightPage'
import NotificationsPage from './pages/NotificationsPage'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'
import PrivateRoute from './components/PrivateRoute'
import { AuthProvider } from './contexts/AuthContext'

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#FFF9F7] text-[#2B2025]">
        <Routes>
          {/* Public Unauthenticated Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Authenticated Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/games" element={<GamesPage />} />
            <Route path="/music" element={<MusicPage />} />
            <Route path="/watch" element={<WatchPage />} />
            <Route path="/memories" element={<MemoriesPage />} />
            <Route path="/dates" element={<DatesPage />} />
            <Route path="/date-night" element={<DateNightPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </div>
    </AuthProvider>
  )
}
