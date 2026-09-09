import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from './LoadingSpinner'

export default function PrivateRoute(){
  const { user, loading } = useAuth()
  if (loading) return <div className="p-8"><LoadingSpinner /></div>
  if (!user) return <Navigate to="/login" replace />
  return <Outlet />
}
