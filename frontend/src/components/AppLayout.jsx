import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import FloatingHeartWave from './FloatingHeartWave'
import MiniMusicPlayer from './MiniMusicPlayer'

export default function AppLayout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, spaceConnection, logout } = useAuth()

  const [mobileOpen, setMobileOpen] = useState(false)


  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '🏡' },
    { path: '/chat', label: 'Private Chat', icon: '💬', badge: '2' },
    { path: '/games', label: 'Couple Games', icon: '🎮' },
    { path: '/music', label: 'Shared Music', icon: '🎵' },
    { path: '/watch', label: 'Watch Together', icon: '🎬' },
    { path: '/memories', label: 'Memories', icon: '📸' },
    { path: '/dates', label: 'Date Planner', icon: '🗓️' },
    { path: '/date-night', label: 'Date Night', icon: '🍷' },
    { path: '/notifications', label: 'Notifications', icon: '🔔', badge: '1' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ]

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const currentUserName = user?.firstName || 'User'
  const displayPartnerName = spaceConnection?.partnerName || 'Partner'

  return (
    <div className="min-h-screen bg-[#FFF9F7] text-[#2B2025] flex flex-col md:flex-row font-sans selection:bg-[#F7DDE4] selection:text-[#9E3155] relative">
      {/* Continuous Left-Side Floating Hearts Animation */}
      <FloatingHeartWave />

      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-[#EADDE2] p-6 justify-between sticky top-0 h-screen shrink-0 z-30">
        <div>
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2 text-2xl font-serif font-bold text-[#681F3B]">
            JustUs <span className="text-[#C44569]">❤️</span>
          </Link>
          <p className="text-[11px] text-[#75676E] mt-0.5 font-medium">Two people. One private space.</p>

          {/* Dynamic Couple Pill */}
          <div className="mt-6 p-3 rounded-2xl bg-[#FFF1F4] border border-[#F7DDE4] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-[#C44569] text-white flex items-center justify-center text-xs font-bold border-2 border-white shadow-xs">
                  {currentUserName.charAt(0)}
                </div>
                {spaceConnection?.connected ? (
                  <div className="w-8 h-8 rounded-full bg-[#9E3155] text-white flex items-center justify-center text-xs font-bold border-2 border-white shadow-xs">
                    {displayPartnerName.charAt(0)}
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-xs font-bold border-2 border-white shadow-xs">
                    ?
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-[#681F3B]">
                  {currentUserName} {spaceConnection?.connected ? `& ${displayPartnerName}` : ''}
                </p>
                <p className="text-[10px] text-[#75676E]">
                  {spaceConnection?.connected ? 'Connected Space ❤️' : 'Disconnected'}
                </p>
              </div>
            </div>
          </div>



          {/* Navigation Links */}
          <nav className="mt-6 space-y-1.5">
            {navItems.map((item) => {
              const active = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    active
                      ? 'bg-[#681F3B] text-white shadow-sm'
                      : 'text-[#75676E] hover:bg-[#FFF1F4] hover:text-[#C44569]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        active ? 'bg-white text-[#681F3B]' : 'bg-[#C44569] text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* User Profile & Logout */}
        <div className="pt-4 border-t border-[#EADDE2] flex items-center justify-between">
          <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 rounded-full bg-[#F7DDE4] border border-[#E98BA5] flex items-center justify-center font-bold text-xs text-[#681F3B]">
              {user?.firstName?.charAt(0) || 'U'}
            </div>
            <div>
              <p className="text-xs font-bold text-[#681F3B]">{user?.firstName || 'User'}</p>
              <p className="text-[10px] text-[#75676E]">View Profile</p>
            </div>
          </Link>
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl text-[#75676E] hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Log out"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </aside>

      {/* Mobile Top Navigation Header */}
      <div className="md:hidden sticky top-0 z-40 bg-white border-b border-[#EADDE2] px-4 py-3 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-1.5 text-xl font-serif font-bold text-[#681F3B]">
          JustUs <span className="text-[#C44569]">❤️</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl text-[#681F3B] bg-[#FFF1F4]"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-x-0 top-[57px] bg-white border-b border-[#EADDE2] z-30 p-4 space-y-2 shadow-xl animate-fadeIn">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center justify-between p-3 rounded-xl text-sm font-semibold ${
                location.pathname === item.path ? 'bg-[#681F3B] text-white' : 'text-[#75676E]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="bg-[#C44569] text-white px-2 py-0.5 rounded-full text-xs">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
          <div className="pt-3 border-t border-[#EADDE2] flex justify-between items-center">
            <Link to="/profile" onClick={() => setMobileOpen(false)} className="text-xs font-semibold text-[#681F3B]">
              My Profile
            </Link>
            <button onClick={handleLogout} className="text-xs font-semibold text-red-600">
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
        {children}
      </main>

      {/* Floating Mini Music Player (Outside /music page) */}
      <MiniMusicPlayer />
    </div>
  )
}
