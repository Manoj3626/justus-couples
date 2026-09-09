import React, { useState, useEffect } from 'react'
import AppLayout from '../components/AppLayout'
import CoupleImage from '../components/CoupleImage'
import { useAuth } from '../contexts/AuthContext'

export default function DatesPage() {
  const {
    specialDates,
    addSpecialDate,
    updateSpecialDate,
    removeSpecialDate,
    toggleDateReminder,
  } = useAuth()

  const [showAddModal, setShowAddModal] = useState(false)
  const [editingDate, setEditingDate] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  // Form State for Add / Edit
  const [formTitle, setFormTitle] = useState('')
  const [formDate, setFormDate] = useState('')
  const [formTime, setFormTime] = useState('19:00')
  const [formType, setFormType] = useState('birthday')
  const [formNotes, setFormNotes] = useState('')

  // Live Timer Ticker State for all dates
  const [nowTimestamp, setNowTimestamp] = useState(Date.now())

  useEffect(() => {
    const interval = setInterval(() => {
      setNowTimestamp(Date.now())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const openAddModal = () => {
    setEditingDate(null)
    setFormTitle('')
    setFormDate('')
    setFormTime('19:00')
    setFormType('birthday')
    setFormNotes('')
    setShowAddModal(true)
  }

  const openEditModal = (item) => {
    setEditingDate(item)
    setFormTitle(item.title)
    setFormDate(item.date)
    setFormTime(item.time || '19:00')
    setFormType(item.type || 'birthday')
    setFormNotes(item.notes || '')
    setShowAddModal(true)
  }

  const handleSaveSubmit = (e) => {
    e.preventDefault()
    if (!formTitle.trim() || !formDate) return

    if (editingDate) {
      const targetId = editingDate._id || editingDate.id
      updateSpecialDate(targetId, {
        title: formTitle,
        date: formDate,
        time: formTime,
        type: formType,
        notes: formNotes,
      })
    } else {
      addSpecialDate({
        title: formTitle,
        date: formDate,
        time: formTime,
        type: formType,
        notes: formNotes,
      })
    }

    setShowAddModal(false)
    setEditingDate(null)
  }

  const confirmDelete = () => {
    if (deletingId) {
      removeSpecialDate(deletingId)
      setDeletingId(null)
    }
  }

  // Calculate remaining time for a date object
  const getCountdown = (dateStr, timeStr) => {
    const target = new Date(`${dateStr}T${timeStr || '00:00'}`).getTime()
    const diff = target - nowTimestamp

    if (diff <= 0) {
      return { expired: true, days: 0, hours: 0, minutes: 0, seconds: 0 }
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    return { expired: false, days, hours, minutes, seconds }
  }

  const getTypeBadge = (type) => {
    switch (type) {
      case 'birthday':
        return { label: '🎂 Birthday', color: 'bg-amber-50 text-amber-700 border-amber-200' }
      case 'anniversary':
        return { label: '💍 Anniversary', color: 'bg-rose-50 text-rose-700 border-rose-200' }
      case 'first_meet':
        return { label: '🌹 First Meet', color: 'bg-purple-50 text-purple-700 border-purple-200' }
      default:
        return { label: '❤️ Custom Special Date', color: 'bg-pink-50 text-pink-700 border-pink-200' }
    }
  }

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#C44569] uppercase tracking-wider bg-[#FFF1F4] px-3.5 py-1 rounded-full border border-[#F7DDE4]">
              COUPLE CALENDAR & COUNTDOWN
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#681F3B] mt-2">
              Shared Date Planner
            </h1>
            <p className="text-sm text-[#75676E] mt-1">
              Synchronized in real-time with your Dashboard & partner space.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="btn-primary px-6 py-3 text-xs font-bold flex items-center gap-2 self-start sm:self-auto shadow-md"
          >
            <span>+ Add Special Date</span>
            <span>🗓️</span>
          </button>
        </div>

        {/* DELETE CONFIRMATION POPUP */}
        {deletingId && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#EADDE2] shadow-2xl text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-3xl mx-auto">
                🗑️
              </div>
              <h3 className="text-xl font-serif font-bold text-[#681F3B]">Remove Special Date?</h3>
              <p className="text-xs text-[#75676E]">
                Are you sure you want to delete this event? This will also remove it from your shared Dashboard countdown.
              </p>
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => setDeletingId(null)}
                  className="flex-1 py-3 rounded-xl border border-[#EADDE2] text-xs font-bold text-[#75676E] hover:bg-[#FFF9F7]"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md"
                >
                  Remove Date
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ADD / EDIT DATE MODAL */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#EADDE2] shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#EADDE2]">
                <h3 className="font-serif font-bold text-xl text-[#681F3B]">
                  {editingDate ? 'Edit Special Date ✏️' : 'Add Special Date 🗓️'}
                </h3>
                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
              </div>

              <form onSubmit={handleSaveSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-[#681F3B] mb-1">Event Title</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Partner's Birthday"
                    className="w-full p-3 rounded-xl border border-[#EADDE2] text-sm focus:outline-none focus:border-[#C44569]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#681F3B] mb-1">Category</label>
                    <select
                      value={formType}
                      onChange={(e) => setFormType(e.target.value)}
                      className="w-full p-3 rounded-xl border border-[#EADDE2] text-xs focus:outline-none focus:border-[#C44569] bg-white font-medium"
                    >
                      <option value="birthday">🎂 Birthday</option>
                      <option value="anniversary">💍 Anniversary</option>
                      <option value="first_meet">🌹 First Meet</option>
                      <option value="custom">❤️ Custom Date</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-[#681F3B] mb-1">Time</label>
                    <input
                      type="time"
                      value={formTime}
                      onChange={(e) => setFormTime(e.target.value)}
                      className="w-full p-3 rounded-xl border border-[#EADDE2] text-xs focus:outline-none focus:border-[#C44569]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#681F3B] mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full p-3 rounded-xl border border-[#EADDE2] text-xs focus:outline-none focus:border-[#C44569]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#681F3B] mb-1">Notes & Details</label>
                  <textarea
                    rows={2}
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="Checklist, reservations, or notes..."
                    className="w-full p-3 rounded-xl border border-[#EADDE2] text-xs focus:outline-none focus:border-[#C44569]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-[#EADDE2] text-[#75676E] font-bold"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary px-6 py-2.5 text-xs font-bold shadow-md">
                    {editingDate ? 'Update Event ✓' : 'Save Special Date ❤️'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* DATES LIST CARDS WITH LIVE COUNTDOWNS OR FRIENDLY EMPTY STATE */}
        {specialDates.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#EADDE2] shadow-sm space-y-4 max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#FFF1F4] text-[#C44569] flex items-center justify-center text-3xl mx-auto">
              🗓️
            </div>
            <h3 className="text-xl font-serif font-bold text-[#681F3B]">No special dates added yet.</h3>
            <p className="text-xs text-[#75676E]">
              Add birthdays, anniversaries, or custom special dates to start tracking live countdown timers.
            </p>
            <button
              onClick={openAddModal}
              className="btn-primary px-6 py-2.5 text-xs font-bold shadow-md inline-flex items-center gap-2"
            >
              <span>+ Add Special Date</span>
              <span>🗓️</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {specialDates.map((item) => {
            const cd = getCountdown(item.date, item.time)
            const badge = getTypeBadge(item.type)

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADDE2] shadow-sm hover:shadow-md transition-all space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[11px] font-bold px-3 py-0.5 rounded-full border ${badge.color}`}>
                        {badge.label}
                      </span>
                      {cd.expired ? (
                        <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 animate-pulse">
                          🎉 Event Started / Today!
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-[#C44569] bg-[#FFF1F4] px-2.5 py-0.5 rounded-full border border-[#F7DDE4]">
                          Upcoming
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif font-bold text-xl text-[#681F3B] pt-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#75676E] font-medium">
                      📅 {new Date(item.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })} at {item.time || '19:00'}
                    </p>
                    {item.notes && (
                      <p className="text-xs text-[#2B2025] italic bg-[#FFF9F7] p-2.5 rounded-xl border border-[#EADDE2] mt-2">
                        "{item.notes}"
                      </p>
                    )}
                  </div>

                  {/* EDIT & REMOVE BUTTONS + REMINDER TOGGLES */}
                  <div className="flex items-center gap-2 flex-wrap shrink-0">
                    <button
                      onClick={() => toggleDateReminder(item.id, 'inApp')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                        item.remindInApp
                          ? 'bg-[#FFF1F4] text-[#C44569] border-[#F7DDE4]'
                          : 'bg-gray-50 text-gray-500 border-gray-200'
                      }`}
                    >
                      🔔 In-App ({item.remindInApp ? 'ON' : 'OFF'})
                    </button>

                    <button
                      onClick={() => toggleDateReminder(item.id, 'sms')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                        item.remindSms
                          ? 'bg-[#FFF1F4] text-[#C44569] border-[#F7DDE4]'
                          : 'bg-gray-50 text-gray-500 border-gray-200'
                      }`}
                    >
                      📱 SMS ({item.remindSms ? 'ON' : 'OFF'})
                    </button>

                    <button
                      onClick={() => openEditModal(item)}
                      className="px-3.5 py-1.5 rounded-xl border border-[#EADDE2] text-xs font-bold text-[#681F3B] hover:bg-[#FFF9F7]"
                    >
                      ✏️ Edit
                    </button>

                    <button
                      onClick={() => setDeletingId(item.id)}
                      className="px-3.5 py-1.5 rounded-xl border border-rose-200 text-xs font-bold text-rose-600 hover:bg-rose-50"
                    >
                      🗑️ Remove
                    </button>
                  </div>
                </div>

                {/* LIVE COUNTDOWN DISPLAY (12 DAYS 08 HOURS 24 MINUTES 36 SECONDS) */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FFF9F7] via-[#FFF0F4] to-[#FFF9F7] border border-[#F7DDE4] flex flex-wrap items-center justify-around gap-4 text-center">
                  <div>
                    <span className="text-2xl sm:text-3xl font-serif font-extrabold text-[#681F3B]">
                      {cd.days}
                    </span>
                    <p className="text-[10px] font-bold text-[#C44569] uppercase tracking-wider">DAYS</p>
                  </div>

                  <span className="text-xl text-[#C44569] font-bold hidden sm:inline">:</span>

                  <div>
                    <span className="text-2xl sm:text-3xl font-serif font-extrabold text-[#681F3B]">
                      {String(cd.hours).padStart(2, '0')}
                    </span>
                    <p className="text-[10px] font-bold text-[#C44569] uppercase tracking-wider">HOURS</p>
                  </div>

                  <span className="text-xl text-[#C44569] font-bold hidden sm:inline">:</span>

                  <div>
                    <span className="text-2xl sm:text-3xl font-serif font-extrabold text-[#681F3B]">
                      {String(cd.minutes).padStart(2, '0')}
                    </span>
                    <p className="text-[10px] font-bold text-[#C44569] uppercase tracking-wider">MINUTES</p>
                  </div>

                  <span className="text-xl text-[#C44569] font-bold hidden sm:inline">:</span>

                  <div>
                    <span className="text-2xl sm:text-3xl font-serif font-extrabold text-[#681F3B] text-rose-600 animate-pulse">
                      {String(cd.seconds).padStart(2, '0')}
                    </span>
                    <p className="text-[10px] font-bold text-[#C44569] uppercase tracking-wider">SECONDS</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        )}
      </div>
    </AppLayout>
  )
}
