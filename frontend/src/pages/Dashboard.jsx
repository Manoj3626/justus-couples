import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import { useAuth } from '../contexts/AuthContext'
import CoupleImage from '../components/CoupleImage'
import HeartBurstAnimation from '../components/HeartBurstAnimation'
import FloatingHeartWave from '../components/FloatingHeartWave'

export default function Dashboard() {
  const {
    user,
    spaceConnection,
    disconnectSpace,
    connectSpace,
    createConnectionCode,
    smsPreferences,
    updateSmsPreferences,
    specialDates,
    addSpecialDate,
    updateSpecialDate,
    removeSpecialDate,
    specialMoments,
    addSpecialMoment,
    notifications,
    relationshipStats,
    sendLoveReaction,
  } = useAuth()

  const navigate = useNavigate()
  const [showDisconnectModal, setShowDisconnectModal] = useState(false)
  const [showAddDateModal, setShowAddDateModal] = useState(false)
  const [editingDate, setEditingDate] = useState(null)
  const [deletingDateId, setDeletingDateId] = useState(null)
  const [showSmsModal, setShowSmsModal] = useState(false)
  const [showAddMomentModal, setShowAddMomentModal] = useState(false)
  const [selectedMemoryModal, setSelectedMemoryModal] = useState(null)
  const [toastMessage, setToastMessage] = useState('')

  const [inputCode, setInputCode] = useState('')
  const [copied, setCopied] = useState(false)
  const [showBurst, setShowBurst] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const isConnected = Boolean(spaceConnection?.connected)
  const currentUserName = user?.firstName || 'User'
  const partnerName = spaceConnection?.partnerName || 'Partner'
  const myCode = spaceConnection?.createdCode || spaceConnection?.code || (user ? createConnectionCode() : 'JUSTUS-8842')

  // --- LIVE COUNTDOWN LOGIC ---
  const [nextEvent, setNextEvent] = useState(null)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: false })

  useEffect(() => {
    if (!specialDates || specialDates.length === 0) {
      setNextEvent(null)
      return
    }

    const now = new Date().getTime()
    const sorted = [...specialDates].sort((a, b) => {
      const timeA = new Date(`${a.date}T${a.time || '00:00'}`).getTime()
      const timeB = new Date(`${b.date}T${b.time || '00:00'}`).getTime()
      return timeA - timeB
    })

    let upcoming = sorted.find((d) => new Date(`${d.date}T${d.time || '00:00'}`).getTime() > now)
    if (!upcoming && sorted.length > 0) {
      upcoming = sorted[0]
    }
    setNextEvent(upcoming)
  }, [specialDates])

  useEffect(() => {
    if (!nextEvent) return

    const targetTime = new Date(`${nextEvent.date}T${nextEvent.time || '00:00'}`).getTime()

    const updateTimer = () => {
      const now = new Date().getTime()
      const diff = targetTime - now

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true })
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeLeft({ days, hours, minutes, seconds, expired: false })
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [nextEvent])

  // --- FORM STATES ---
  const [dateTitle, setDateTitle] = useState('')
  const [dateStr, setDateStr] = useState('')
  const [dateTimeStr, setDateTimeStr] = useState('19:00')
  const [dateType, setDateType] = useState('birthday')
  const [dateNotes, setDateNotes] = useState('')

  const [phoneNumberInput, setPhoneNumberInput] = useState(smsPreferences?.phoneNumber || '')
  const [smsEnabledInput, setSmsEnabledInput] = useState(smsPreferences?.enabled ?? true)

  const [momentTitle, setMomentTitle] = useState('')
  const [momentNote, setMomentNote] = useState('')
  const [momentFileDataUrl, setMomentFileDataUrl] = useState('')
  const [momentFileType, setMomentFileType] = useState('photo')
  const [momentFileName, setMomentFileName] = useState('')
  const fileInputRef = useRef(null)

  const triggerToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 3000)
  }

  const handleCopyCode = () => {
    if (!myCode) return
    navigator.clipboard?.writeText(myCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleConnectWithCode = (e) => {
    e?.preventDefault()
    if (!inputCode.trim()) {
      setErrorMsg('Please enter a valid connection code!')
      return
    }
    setErrorMsg('')
    connectSpace(inputCode)
    setShowBurst(true)
    triggerToast('❤️ Connected space successfully!')
  }

  const handleInstantDemoConnect = () => {
    connectSpace(myCode || 'JUSTUS-8842')
    setShowBurst(true)
    triggerToast('⚡ Connected with partner space!')
  }

  const handleConfirmDisconnect = () => {
    disconnectSpace()
    setShowDisconnectModal(false)
    triggerToast('Disconnected space successfully.')
  }

  const openAddDateModal = () => {
    setEditingDate(null)
    setDateTitle('')
    setDateStr('')
    setDateTimeStr('19:00')
    setDateType('birthday')
    setDateNotes('')
    setShowAddDateModal(true)
  }

  const openEditDateModal = (item) => {
    setEditingDate(item)
    setDateTitle(item.title)
    setDateStr(item.date)
    setDateTimeStr(item.time || '19:00')
    setDateType(item.type || 'birthday')
    setDateNotes(item.notes || '')
    setShowAddDateModal(true)
  }

  const handleSaveDate = (e) => {
    e.preventDefault()
    if (!dateTitle.trim() || !dateStr) return

    if (editingDate) {
      updateSpecialDate(editingDate.id, {
        title: dateTitle,
        date: dateStr,
        time: dateTimeStr,
        type: dateType,
        notes: dateNotes,
      })
      triggerToast('✏️ Special date updated & synced!')
    } else {
      addSpecialDate({
        title: dateTitle,
        date: dateStr,
        time: dateTimeStr,
        type: dateType,
        notes: dateNotes,
      })
      triggerToast('🗓️ New special date added & synced!')
    }

    setShowAddDateModal(false)
    setEditingDate(null)
  }

  const confirmRemoveDate = () => {
    if (deletingDateId) {
      removeSpecialDate(deletingDateId)
      setDeletingDateId(null)
      triggerToast('🗑️ Date removed successfully.')
    }
  }

  const handleSaveSmsPref = (e) => {
    e.preventDefault()
    updateSmsPreferences({
      enabled: smsEnabledInput,
      phoneNumber: phoneNumberInput,
    })
    setShowSmsModal(false)
    triggerToast(smsEnabledInput ? `📱 SMS reminders active for ${phoneNumberInput}` : '📱 SMS notifications disabled.')
  }

  const handleMomentFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setMomentFileName(file.name)
    const isVid = file.type.startsWith('video')
    setMomentFileType(isVid ? 'video' : 'photo')

    const reader = new FileReader()
    reader.onload = (evt) => {
      setMomentFileDataUrl(evt.target?.result || '')
    }
    reader.readAsDataURL(file)
  }

  const handleSaveMoment = (e) => {
    e.preventDefault()
    if (!momentTitle.trim()) return
    addSpecialMoment({
      title: momentTitle,
      note: momentNote || '',
      mediaUrl: momentFileDataUrl,
      mediaType: momentFileType,
    })
    setShowAddMomentModal(false)
    setMomentTitle('')
    setMomentNote('')
    setMomentFileDataUrl('')
    setMomentFileName('')
    triggerToast('📸 Special moment saved to memory timeline!')
  }

  const handleSendLoveClick = () => {
    sendLoveReaction()
    setShowBurst(true)
    triggerToast(`❤️ Sent a love reaction to ${partnerName}!`)
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
        return { label: '❤️ Custom Date', color: 'bg-pink-50 text-pink-700 border-pink-200' }
    }
  }

  return (
    <AppLayout>
      {/* Continuous Left-Side Floating Hearts Animation Wave */}
      <FloatingHeartWave />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#681F3B] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#F7DDE4] text-xs font-bold animate-fadeIn flex items-center gap-2">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Heart Burst Connection Animation */}
      <HeartBurstAnimation active={showBurst} onComplete={() => setShowBurst(false)} />

      {/* 1. DISCONNECT CONFIRMATION MODAL */}
      {showDisconnectModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#EADDE2] shadow-2xl space-y-4 text-center">
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-3xl mx-auto shadow-inner">
              💔
            </div>
            <h3 className="text-xl font-serif font-bold text-[#681F3B]">
              Remove Connection / Disconnect Space?
            </h3>
            <p className="text-xs sm:text-sm text-[#75676E] leading-relaxed">
              Are you sure you want to disconnect from <strong className="text-[#681F3B]">{partnerName}</strong>? You can return to Connection Setup anytime.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => setShowDisconnectModal(false)}
                className="flex-1 py-3 rounded-xl border border-[#EADDE2] text-xs font-bold text-[#75676E] hover:bg-[#FFF9F7] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDisconnect}
                className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition-colors"
              >
                Disconnect Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. REMOVE DATE CONFIRMATION POPUP */}
      {deletingDateId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#EADDE2] shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-3xl mx-auto">
              🗑️
            </div>
            <h3 className="text-xl font-serif font-bold text-[#681F3B]">Remove Special Date?</h3>
            <p className="text-xs text-[#75676E]">
              Are you sure you want to delete this event? This will update both the Dashboard and Date Planner page.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => setDeletingDateId(null)}
                className="flex-1 py-3 rounded-xl border border-[#EADDE2] text-xs font-bold text-[#75676E] hover:bg-[#FFF9F7]"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemoveDate}
                className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md"
              >
                Remove Date
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. ADD / EDIT SPECIAL DATE MODAL */}
      {showAddDateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#EADDE2] shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#EADDE2]">
              <h3 className="font-serif font-bold text-xl text-[#681F3B]">
                {editingDate ? 'Edit Special Date ✏️' : 'Add Special Date 🗓️'}
              </h3>
              <button onClick={() => setShowAddDateModal(false)} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
            </div>

            <form onSubmit={handleSaveDate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#681F3B] mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  value={dateTitle}
                  onChange={(e) => setDateTitle(e.target.value)}
                  placeholder="e.g. Partner's Birthday"
                  className="w-full p-3 rounded-xl border border-[#EADDE2] text-sm focus:outline-none focus:border-[#C44569]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#681F3B] mb-1">Category</label>
                  <select
                    value={dateType}
                    onChange={(e) => setDateType(e.target.value)}
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
                    value={dateTimeStr}
                    onChange={(e) => setDateTimeStr(e.target.value)}
                    className="w-full p-3 rounded-xl border border-[#EADDE2] text-xs focus:outline-none focus:border-[#C44569]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#681F3B] mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={dateStr}
                  onChange={(e) => setDateStr(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#EADDE2] text-xs focus:outline-none focus:border-[#C44569]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#681F3B] mb-1">Notes / Details</label>
                <textarea
                  rows={2}
                  value={dateNotes}
                  onChange={(e) => setDateNotes(e.target.value)}
                  placeholder="Gift ideas, reservation details, or checklist..."
                  className="w-full p-3 rounded-xl border border-[#EADDE2] text-xs focus:outline-none focus:border-[#C44569]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddDateModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#EADDE2] text-[#75676E] font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary px-6 py-2.5 text-xs font-bold shadow-md">
                  {editingDate ? 'Update Date ✓' : 'Save & Sync Date ⏳'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. SMS REMINDER PREFERENCES MODAL */}
      {showSmsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#EADDE2] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EADDE2]">
              <h3 className="font-serif font-bold text-xl text-[#681F3B]">SMS & Notification Options 📱</h3>
              <button onClick={() => setShowSmsModal(false)} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
            </div>

            <form onSubmit={handleSaveSmsPref} className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FFF9F7] border border-[#EADDE2]">
                <div>
                  <p className="font-bold text-[#681F3B]">SMS Reminders</p>
                  <p className="text-[11px] text-[#75676E]">Send text alert when event countdown ends</p>
                </div>
                <input
                  type="checkbox"
                  checked={smsEnabledInput}
                  onChange={(e) => setSmsEnabledInput(e.target.checked)}
                  className="w-5 h-5 accent-[#C44569] cursor-pointer"
                />
              </div>

              <div>
                <label className="block font-bold text-[#681F3B]">Mobile Phone Number</label>
                <input
                  type="tel"
                  value={phoneNumberInput}
                  onChange={(e) => setPhoneNumberInput(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full p-3.5 rounded-xl border border-[#EADDE2] text-sm font-mono focus:outline-none focus:border-[#C44569]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowSmsModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#EADDE2] text-[#75676E] font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary px-5 py-2.5 text-xs font-bold shadow-md">
                  Save Preferences ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. ADD MOMENT MODAL WITH FILE UPLOAD */}
      {showAddMomentModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#EADDE2] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#EADDE2]">
              <h3 className="font-serif font-bold text-xl text-[#681F3B]">Save Special Moment 📸</h3>
              <button onClick={() => setShowAddMomentModal(false)} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
            </div>

            <form onSubmit={handleSaveMoment} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#681F3B] mb-1">Upload Photo or Video File</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleMomentFileSelect}
                  accept="image/*,video/*"
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#C44569]/40 hover:border-[#C44569] bg-[#FFF9F7] rounded-2xl p-3.5 text-center cursor-pointer transition-colors space-y-1"
                >
                  {momentFileDataUrl ? (
                    <div className="space-y-1">
                      {momentFileType === 'video' ? (
                        <video src={momentFileDataUrl} className="h-28 mx-auto rounded-xl object-cover" />
                      ) : (
                        <img src={momentFileDataUrl} alt="Preview" className="h-28 mx-auto rounded-xl object-cover" />
                      )}
                      <p className="text-xs font-bold text-[#681F3B]">✓ Selected: {momentFileName}</p>
                    </div>
                  ) : (
                    <>
                      <span className="text-2xl block">📁</span>
                      <p className="font-bold text-[#681F3B] text-xs">Click to select photo or video</p>
                    </>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#681F3B] mb-1">Moment Title</label>
                <input
                  type="text"
                  required
                  value={momentTitle}
                  onChange={(e) => setMomentTitle(e.target.value)}
                  placeholder="e.g. Sunset Picnic at the Park"
                  className="w-full p-3 rounded-xl border border-[#EADDE2] text-sm focus:outline-none focus:border-[#C44569]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#681F3B] mb-1">Note / Memory Story</label>
                <textarea
                  rows={3}
                  value={momentNote}
                  onChange={(e) => setMomentNote(e.target.value)}
                  placeholder="Write a sweet memory or note..."
                  className="w-full p-3 rounded-xl border border-[#EADDE2] text-xs focus:outline-none focus:border-[#C44569]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddMomentModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#EADDE2] text-[#75676E] font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary px-5 py-2.5 text-xs font-bold shadow-md">
                  Save Moment ❤️
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MEMORY PREVIEW MODAL */}
      {selectedMemoryModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full border border-[#EADDE2] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EADDE2]">
              <h3 className="font-serif font-bold text-xl text-[#681F3B]">{selectedMemoryModal.title}</h3>
              <button onClick={() => setSelectedMemoryModal(null)} className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 font-bold">✕</button>
            </div>
            <div className="rounded-2xl overflow-hidden bg-black border border-[#EADDE2] flex items-center justify-center">
              {selectedMemoryModal.mediaUrl ? (
                selectedMemoryModal.mediaType === 'video' ? (
                  <video src={selectedMemoryModal.mediaUrl} controls autoPlay className="w-full max-h-[60vh] object-contain" />
                ) : (
                  <img src={selectedMemoryModal.mediaUrl} alt={selectedMemoryModal.title} className="w-full max-h-[60vh] object-contain" />
                )
              ) : (
                <CoupleImage folder={selectedMemoryModal.folder || 'memories'} alt={selectedMemoryModal.title} className="w-full max-h-[50vh] object-cover" />
              )}
            </div>
            {selectedMemoryModal.note && (
              <p className="text-xs text-[#2B2025] bg-[#FFF9F7] p-3 rounded-xl border border-[#EADDE2]">{selectedMemoryModal.note}</p>
            )}
            <div className="flex justify-end">
              <button onClick={() => setSelectedMemoryModal(null)} className="btn-primary px-5 py-2 text-xs font-bold">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* DASHBOARD MAIN LAYOUT */}
      <div className="space-y-8 animate-fadeIn">

        {/* HEADER SECTION: CONNECTED OR UNCONNECTED SETUP CARD */}
        {!isConnected ? (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADDE2] shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-[#C44569] uppercase tracking-wider bg-[#FFF1F4] px-4 py-1.5 rounded-full border border-[#F7DDE4]">
                  CONNECTION SETUP
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#681F3B] mt-2">
                  Connect With Your Partner
                </h2>
                <p className="text-xs sm:text-sm text-[#75676E] mt-1">
                  Select one of the two choices below to link your private space together:
                </p>
              </div>

              <button
                onClick={handleInstantDemoConnect}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#C44569] to-[#9E3155] hover:opacity-95 text-white text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-2 shrink-0"
              >
                <span>⚡ Instant Connect Partner</span>
                <span>♡</span>
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* CHOICE 1 */}
              <div className="bg-[#FFF9F7] p-6 rounded-3xl border border-[#EADDE2] flex flex-col justify-between space-y-5 hover:border-[#C44569] transition-all">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="w-10 h-10 rounded-2xl bg-[#FFF1F4] text-[#C44569] flex items-center justify-center font-bold text-lg border border-[#F7DDE4]">
                      1️⃣
                    </span>
                    <span className="text-[11px] font-bold text-[#681F3B] bg-white px-3 py-1 rounded-full border border-[#EADDE2]">
                      Choice 1
                    </span>
                  </div>
                  <h3 className="text-lg font-serif font-bold text-[#681F3B] mt-4">
                    Create a Connection Code
                  </h3>
                  <p className="text-xs text-[#75676E] mt-1 leading-relaxed">
                    Generate a unique connection code for yourself and share it with your partner.
                  </p>

                  <div className="mt-5">
                    {myCode ? (
                      <div className="p-4 rounded-2xl bg-white border border-[#EADDE2] shadow-xs space-y-2">
                        <p className="text-[10px] font-bold uppercase text-[#75676E]">Your Connection Code:</p>
                        <div className="flex items-center justify-between font-mono font-bold text-base text-[#681F3B]">
                          <span>{myCode}</span>
                          <button
                            onClick={handleCopyCode}
                            className="px-3 py-1.5 rounded-lg bg-[#FFF0F4] text-[#C44569] text-xs font-sans font-bold hover:bg-[#F7DDE4] transition-colors"
                          >
                            {copied ? '✓ Copied!' : '📋 Copy Code'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={createConnectionCode}
                        className="w-full py-3.5 rounded-xl bg-[#681F3B] hover:bg-[#9E3155] text-white text-xs font-bold shadow-md transition-colors"
                      >
                        Generate Connection Code
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-[11px] text-[#75676E] italic">
                  Send this code to your partner so they can enter it on their device.
                </p>
              </div>

              {/* CHOICE 2 */}
              <div className="bg-[#FFF9F7] p-6 rounded-3xl border border-[#EADDE2] flex flex-col justify-between space-y-5 hover:border-[#C44569] transition-all">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="w-10 h-10 rounded-2xl bg-[#FFF1F4] text-[#C44569] flex items-center justify-center font-bold text-lg border border-[#F7DDE4]">
                      2️⃣
                    </span>
                    <span className="text-[11px] font-bold text-[#681F3B] bg-white px-3 py-1 rounded-full border border-[#EADDE2]">
                      Choice 2
                    </span>
                  </div>
                  <h3 className="text-lg font-serif font-bold text-[#681F3B] mt-4">
                    Enter a Connection Code
                  </h3>
                  <p className="text-xs text-[#75676E] mt-1 leading-relaxed">
                    Have a code from your partner? Enter it below and click Connect to link spaces.
                  </p>

                  <form onSubmit={handleConnectWithCode} className="mt-5 space-y-3">
                    <input
                      type="text"
                      value={inputCode}
                      onChange={(e) => {
                        setInputCode(e.target.value.toUpperCase())
                        setErrorMsg('')
                      }}
                      placeholder="Enter code (e.g. JUSTUS-8842)"
                      className="w-full p-3.5 rounded-2xl border border-[#EADDE2] text-sm font-mono font-bold tracking-wider text-[#681F3B] uppercase focus:outline-none focus:border-[#C44569] bg-white shadow-xs"
                    />
                    {errorMsg && <p className="text-xs text-rose-600 font-semibold">{errorMsg}</p>}

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#C44569] to-[#9E3155] hover:opacity-95 text-white text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Connect Space</span>
                      <span>♡</span>
                    </button>
                  </form>
                </div>
                <p className="text-[11px] text-[#75676E] italic">
                  Once connected, your shared space links dynamically.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* CONNECTED DASHBOARD HEADER */
          <div className="bg-gradient-to-r from-[#681F3B] via-[#8D2D4F] to-[#9E3155] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  <div className="w-14 h-14 rounded-full bg-white text-[#681F3B] font-serif font-bold text-xl flex items-center justify-center border-4 border-white/20 shadow-lg">
                    {currentUserName.charAt(0)}
                  </div>
                  <div className="w-14 h-14 rounded-full bg-[#F7DDE4] text-[#9E3155] font-serif font-bold text-xl flex items-center justify-center border-4 border-white/20 shadow-lg relative">
                    {partnerName.charAt(0)}
                    <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full" title="Online now" />
                  </div>
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 text-white text-xs font-semibold mb-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Today's Connection: Active Now</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold">
                    Welcome back, {currentUserName}!
                  </h1>
                  <p className="text-xs sm:text-sm text-white/80 mt-1">
                    Connected with <strong className="text-white">{partnerName}</strong> (Space Code: {myCode})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 flex-wrap">
                <div className="bg-white/15 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 flex items-center gap-3">
                  <span className="text-2xl">🗓️</span>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-white/80">Together Counter</p>
                    <p className="text-sm font-serif font-bold text-white">{relationshipStats.daysConnected} Days & Counting</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowDisconnectModal(true)}
                  className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-rose-600/80 backdrop-blur-md border border-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow"
                  title="Disconnect from partner space"
                >
                  <span>💔</span>
                  <span>Remove Connection</span>
                </button>
              </div>
            </div>

            {/* QUICK ACTIONS TOOLBAR INSIDE HEADER */}
            <div className="mt-8 pt-6 border-t border-white/20 flex flex-wrap gap-2.5">
              <Link to="/music" className="px-4 py-2.5 rounded-xl bg-white text-[#681F3B] font-bold text-xs flex items-center gap-2 hover:bg-[#FFF1F4] transition-colors shadow">
                🎵 Start Music Together
              </Link>
              <Link to="/watch" className="px-4 py-2.5 rounded-xl bg-white/15 text-white font-semibold text-xs flex items-center gap-2 hover:bg-white/25 transition-colors border border-white/20">
                🎬 Watch Video Together
              </Link>
              <Link to="/chat" className="px-4 py-2.5 rounded-xl bg-white/15 text-white font-semibold text-xs flex items-center gap-2 hover:bg-white/25 transition-colors border border-white/20">
                💬 Open Chat
              </Link>
              <button
                onClick={handleSendLoveClick}
                className="px-4 py-2.5 rounded-xl bg-rose-500/90 text-white font-bold text-xs flex items-center gap-2 hover:bg-rose-600 transition-colors border border-white/30 shadow-md"
              >
                ❤️ Send Love Reaction
              </button>
              <button
                onClick={openAddDateModal}
                className="px-4 py-2.5 rounded-xl bg-white/15 text-white font-semibold text-xs flex items-center gap-2 hover:bg-white/25 transition-colors border border-white/20"
              >
                📅 Add Special Date
              </button>
            </div>
          </div>
        )}

        {/* DATE PLANNER & LIVE COUNTDOWN SECTION */}
        {nextEvent ? (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADDE2] shadow-lg space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EADDE2] pb-5">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-[11px] font-bold text-[#C44569] uppercase tracking-wider bg-[#FFF1F4] px-3.5 py-1 rounded-full border border-[#F7DDE4]">
                    ⏳ LIVE DATE PLANNER COUNTDOWN
                  </span>
                  <span className={`text-[11px] font-bold px-3 py-0.5 rounded-full border ${getTypeBadge(nextEvent.type).color}`}>
                    {getTypeBadge(nextEvent.type).label}
                  </span>
                  {timeLeft.expired && (
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 animate-pulse">
                      🎉 Event Started / Today!
                    </span>
                  )}
                </div>

                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#681F3B] mt-2">
                  {nextEvent.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#75676E] mt-1">
                  📅 {new Date(nextEvent.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })} at {nextEvent.time || '19:00'} {nextEvent.notes && `• ${nextEvent.notes}`}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                <button
                  onClick={() => openEditDateModal(nextEvent)}
                  className="px-3.5 py-2 rounded-xl border border-[#EADDE2] text-xs font-bold text-[#681F3B] hover:bg-[#FFF9F7] transition-colors"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => setDeletingDateId(nextEvent.id)}
                  className="px-3.5 py-2 rounded-xl border border-rose-200 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  🗑️ Remove
                </button>
                <button
                  onClick={() => setShowSmsModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-[#FFF9F7] border border-[#EADDE2] text-xs font-bold text-[#681F3B] hover:border-[#C44569] transition-colors flex items-center gap-1.5"
                >
                  <span>📱</span>
                  <span>SMS Reminders ({smsPreferences?.enabled ? 'ON' : 'OFF'})</span>
                </button>
                <button
                  onClick={openAddDateModal}
                  className="px-4 py-2 rounded-xl bg-[#681F3B] hover:bg-[#9E3155] text-white text-xs font-bold shadow-md transition-colors"
                >
                  + Add Date
                </button>
              </div>
            </div>

            {/* COUNTDOWN CLOCK BOXES */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-center">
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#FFF9F7] to-[#FFF0F4] border border-[#F7DDE4] shadow-xs">
                <span className="text-3xl sm:text-4xl font-serif font-extrabold text-[#681F3B] tracking-tight">
                  {timeLeft.days}
                </span>
                <p className="text-[10px] font-bold uppercase text-[#C44569] tracking-wider mt-1">Days</p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#FFF9F7] to-[#FFF0F4] border border-[#F7DDE4] shadow-xs">
                <span className="text-3xl sm:text-4xl font-serif font-extrabold text-[#681F3B] tracking-tight">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <p className="text-[10px] font-bold uppercase text-[#C44569] tracking-wider mt-1">Hours</p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#FFF9F7] to-[#FFF0F4] border border-[#F7DDE4] shadow-xs">
                <span className="text-3xl sm:text-4xl font-serif font-extrabold text-[#681F3B] tracking-tight">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <p className="text-[10px] font-bold uppercase text-[#C44569] tracking-wider mt-1">Minutes</p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#FFF9F7] to-[#FFF0F4] border border-[#F7DDE4] shadow-xs">
                <span className="text-3xl sm:text-4xl font-serif font-extrabold text-[#681F3B] tracking-tight text-rose-600 animate-pulse">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <p className="text-[10px] font-bold uppercase text-[#C44569] tracking-wider mt-1">Seconds</p>
              </div>
            </div>

            {/* UPCOMING SPECIAL DATES LIST CHIPS */}
            <div className="pt-2 flex items-center justify-between border-t border-[#EADDE2] gap-2 overflow-x-auto text-xs">
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <span className="font-bold text-[#75676E] text-[11px] shrink-0">Upcoming Events:</span>
                {specialDates.map((d) => (
                  <span
                    key={d.id}
                    onClick={() => setNextEvent(d)}
                    className={`px-3 py-1 rounded-full border text-[11px] font-medium cursor-pointer transition-all shrink-0 ${
                      nextEvent?.id === d.id
                        ? 'bg-[#681F3B] text-white border-[#681F3B] font-bold shadow'
                        : 'bg-[#FFF9F7] text-[#681F3B] border-[#EADDE2] hover:border-[#C44569]'
                    }`}
                  >
                    {d.title} ({d.date})
                  </span>
                ))}
              </div>

              <Link to="/dates" className="text-xs font-bold text-[#C44569] hover:underline shrink-0 flex items-center gap-1">
                <span>View All Date Planner</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        ) : (
          /* FRIENDLY EMPTY STATE FOR DATE PLANNER */
          <div className="bg-white rounded-3xl p-8 border border-[#EADDE2] shadow-sm text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#FFF1F4] text-[#C44569] flex items-center justify-center text-2xl mx-auto">
              🗓️
            </div>
            <h3 className="text-lg font-serif font-bold text-[#681F3B]">No special dates added yet.</h3>
            <p className="text-xs text-[#75676E] max-w-sm mx-auto">
              Add birthdays, anniversaries, or custom special dates to start live countdown timers.
            </p>
            <button
              onClick={openAddDateModal}
              className="btn-primary px-5 py-2.5 text-xs font-bold shadow-md inline-flex items-center gap-2"
            >
              <span>+ Add Special Date</span>
              <span>🗓️</span>
            </button>
          </div>
        )}

        {/* MINI RELATIONSHIP STATS GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-[#EADDE2] shadow-xs text-center hover:border-[#C44569] transition-all">
            <span className="text-2xl">🗓️</span>
            <p className="text-2xl font-serif font-bold text-[#681F3B] mt-1">{relationshipStats.daysConnected}</p>
            <p className="text-[11px] font-semibold text-[#75676E]">Days Connected</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-[#EADDE2] shadow-xs text-center hover:border-[#C44569] transition-all">
            <span className="text-2xl">📸</span>
            <p className="text-2xl font-serif font-bold text-[#681F3B] mt-1">{relationshipStats.momentsSaved}</p>
            <p className="text-[11px] font-semibold text-[#75676E]">Moments Saved</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-[#EADDE2] shadow-xs text-center hover:border-[#C44569] transition-all">
            <span className="text-2xl">🎵</span>
            <p className="text-2xl font-serif font-bold text-[#681F3B] mt-1">{relationshipStats.songsShared}</p>
            <p className="text-[11px] font-semibold text-[#75676E]">Songs Shared</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-[#EADDE2] shadow-xs text-center hover:border-[#C44569] transition-all">
            <span className="text-2xl">🎬</span>
            <p className="text-2xl font-serif font-bold text-[#681F3B] mt-1">{relationshipStats.videosWatched}</p>
            <p className="text-[11px] font-semibold text-[#75676E]">Videos Watched</p>
          </div>
        </div>

        {/* FEATURE WIDGETS GRID */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* WIDGET 1: SHARED MUSIC STATUS */}
          <div className="bg-white rounded-3xl p-6 border border-[#EADDE2] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#681F3B] uppercase tracking-wider">🎵 Shared Playlist</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full text-emerald-600 bg-emerald-50">
                  Live Sync
                </span>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#C44569] text-white flex items-center justify-center font-bold text-lg shadow">
                  🎧
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#2B2025]">Shared Music Room</h4>
                  <p className="text-xs text-[#75676E]">Play online songs or local music together</p>
                </div>
              </div>
            </div>
            <Link to="/music" className="mt-4 text-xs font-bold text-[#C44569] hover:underline flex items-center gap-1">
              <span>Open Music Player</span>
              <span>→</span>
            </Link>
          </div>

          {/* WIDGET 2: RECENT MEMORIES & MOMENTS */}
          <div className="bg-white rounded-3xl p-6 border border-[#EADDE2] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#681F3B] uppercase tracking-wider">📸 Special Moments</span>
                <button onClick={() => setShowAddMomentModal(true)} className="text-[11px] font-bold text-[#C44569] hover:underline">
                  + Save Moment
                </button>
              </div>
              {specialMoments.length > 0 ? (
                <div className="cursor-pointer" onClick={() => setSelectedMemoryModal(specialMoments[0])}>
                  {specialMoments[0].mediaUrl ? (
                    specialMoments[0].mediaType === 'video' ? (
                      <div className="relative aspect-video rounded-2xl overflow-hidden bg-black flex items-center justify-center mb-2">
                        <video src={specialMoments[0].mediaUrl} className="w-full h-28 object-cover" />
                        <span className="absolute w-10 h-10 rounded-full bg-[#C44569] text-white flex items-center justify-center text-lg">🎬</span>
                      </div>
                    ) : (
                      <img src={specialMoments[0].mediaUrl} alt={specialMoments[0].title} className="w-full h-28 rounded-2xl object-cover mb-2 border border-[#EADDE2]" />
                    )
                  ) : (
                    <CoupleImage folder={specialMoments[0].folder || 'memories'} alt={specialMoments[0].title} className="w-full h-28 rounded-2xl object-cover mb-2" aspect="16/9" />
                  )}
                  <h4 className="font-serif font-bold text-sm text-[#2B2025]">{specialMoments[0].title}</h4>
                  {specialMoments[0].note && (
                    <p className="text-xs text-[#75676E] italic mt-0.5 line-clamp-2">"{specialMoments[0].note}"</p>
                  )}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-[#FFF9F7] border border-[#EADDE2] text-center my-2 space-y-1">
                  <p className="text-xs font-bold text-[#681F3B]">No uploaded memories yet.</p>
                  <p className="text-[11px] text-[#75676E]">Save your first photo or video moment!</p>
                </div>
              )}
            </div>
            <Link to="/memories" className="mt-4 text-xs font-bold text-[#C44569] hover:underline flex items-center gap-1">
              <span>View Memories Timeline</span>
              <span>→</span>
            </Link>
          </div>

          {/* WIDGET 3: NOTIFICATIONS PANEL */}
          <div className="bg-white rounded-3xl p-6 border border-[#EADDE2] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#681F3B] uppercase tracking-wider">🔔 Activity Notifications</span>
                <span className="text-[10px] font-bold text-[#C44569] bg-[#FFF1F4] px-2 py-0.5 rounded-full">
                  {notifications.length} Alerts
                </span>
              </div>
              {notifications.length > 0 ? (
                <div className="space-y-2 text-xs">
                  {notifications.slice(0, 3).map((n) => (
                    <div key={n.id} className="p-2.5 rounded-xl bg-[#FFF9F7] border border-[#EADDE2] flex items-start gap-2">
                      <span className="text-sm">✨</span>
                      <div>
                        <p className="font-bold text-[#681F3B] text-[11px]">{n.title}</p>
                        <p className="text-[#75676E] text-[11px]">{n.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-[#FFF9F7] border border-[#EADDE2] text-center my-2">
                  <p className="text-xs font-bold text-[#681F3B]">No notifications yet.</p>
                  <p className="text-[11px] text-[#75676E]">Activity updates will appear here.</p>
                </div>
              )}
            </div>
            <Link to="/chat" className="mt-4 text-xs font-bold text-[#C44569] hover:underline flex items-center gap-1">
              <span>Open Chat & Messages</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
