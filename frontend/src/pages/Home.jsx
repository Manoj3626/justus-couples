import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Home(){
  const { user } = useAuth()
  return (
    <div className="p-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Good evening, {user?.firstName} ❤️</h1>
        <div className="flex items-center gap-4">
          <Link to="/profile" className="text-sm text-[#5B315D]">Profile</Link>
        </div>
      </header>
      <section className="mt-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">Your dashboard is coming soon — features are still being implemented.</div>
      </section>
    </div>
  )
}
