import React, { useState } from 'react'
import AppLayout from '../components/AppLayout'
import { useAuth } from '../contexts/AuthContext'

export default function ProfilePage() {
  const { user, spaceConnection, logout } = useAuth()
  const [name, setName] = useState(user?.firstName || 'User')
  const [partnerName, setPartnerName] = useState(spaceConnection?.partnerName || 'Partner')
  const [relationshipDate, setRelationshipDate] = useState('')
  const [nickname, setNickname] = useState('My Love')
  const [saved, setSaved] = useState(false)

  const handleSave = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#681F3B]">Profile & Couple Settings</h1>
          <p className="text-sm text-[#75676E] mt-1">Manage your personal account details and your couple relationship space.</p>
        </div>

        {saved && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold animate-fadeIn">
            ✓ Couple profile settings updated successfully!
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Personal Profile Card */}
          <div className="bg-white rounded-3xl p-6 border border-[#EADDE2] shadow-sm">
            <h3 className="text-lg font-serif font-bold text-[#681F3B] mb-4">👤 Your Profile</h3>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-[#C44569] text-white font-serif font-bold text-2xl flex items-center justify-center border-2 border-white shadow">
                {name.charAt(0)}
              </div>
              <div>
                <p className="text-base font-bold text-[#2B2025]">{name}</p>
                <p className="text-xs text-[#75676E]">{user?.email || 'User Account'}</p>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-1 inline-block">
                  Verified Member
                </span>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#681F3B] mb-1">First Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#EADDE2] text-sm focus:outline-none focus:border-[#C44569]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#681F3B] mb-1">Email Address</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  placeholder="Not logged in"
                  className="w-full p-3 rounded-xl border border-[#EADDE2] bg-[#FFF9F7] text-sm text-[#75676E]"
                />
              </div>
            </form>
          </div>

          {/* Couple Profile Card */}
          <div className="bg-white rounded-3xl p-6 border border-[#EADDE2] shadow-sm">
            <h3 className="text-lg font-serif font-bold text-[#681F3B] mb-4">❤️ Couple Space Profile</h3>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#681F3B] mb-1">Partner's Name</label>
                <input
                  type="text"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#EADDE2] text-sm focus:outline-none focus:border-[#C44569]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#681F3B] mb-1">Partner Nickname</label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#EADDE2] text-sm focus:outline-none focus:border-[#C44569]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#681F3B] mb-1">Relationship Anniversary Date</label>
                <input
                  type="date"
                  value={relationshipDate}
                  onChange={(e) => setRelationshipDate(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#EADDE2] text-sm focus:outline-none focus:border-[#C44569]"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#FFF9F7] border border-[#EADDE2]">
                <p className="text-[11px] text-[#75676E] font-medium">Space Connection Code</p>
                <p className="font-mono text-sm font-bold text-[#681F3B] mt-0.5">
                  {spaceConnection?.code || spaceConnection?.createdCode || 'Not Connected'}
                </p>
              </div>

              <button type="submit" className="w-full btn-primary py-3 text-sm font-bold mt-4">
                Save Profile Changes ❤️
              </button>
            </form>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            onClick={logout}
            className="px-6 py-2.5 rounded-xl border border-red-200 text-red-600 font-semibold text-xs hover:bg-red-50 transition-colors"
          >
            Log Out of Account
          </button>
        </div>
      </div>
    </AppLayout>
  )
}
