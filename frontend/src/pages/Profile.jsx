import React from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function Profile(){
  const { user, logout } = useAuth()
  if (!user) return null
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold">Your Profile</h2>
      <div className="mt-4 bg-white p-6 rounded-xl shadow-sm">
        <p><strong>Name:</strong> {user.firstName}</p>
        <p className="mt-2"><strong>Email:</strong> {user.email}</p>
        <button onClick={logout} className="mt-6 px-4 py-2 rounded-md bg-[#E8DFE2]">Log out</button>
      </div>
    </div>
  )
}
