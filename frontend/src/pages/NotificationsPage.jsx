import React from 'react'
import AppLayout from '../components/AppLayout'
import { useAuth } from '../contexts/AuthContext'

export default function NotificationsPage() {
  const { notifications } = useAuth()

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#C44569] uppercase tracking-wider bg-[#FFF1F4] px-3.5 py-1 rounded-full border border-[#F7DDE4]">
              NOTIFICATION CENTER
            </span>
            <h1 className="text-3xl font-serif font-bold text-[#681F3B] mt-3">Notifications</h1>
            <p className="text-sm text-[#75676E] mt-1">Real-time activity and alerts in your shared space.</p>
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#EADDE2] shadow-sm space-y-3 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#FFF1F4] text-[#C44569] flex items-center justify-center text-3xl mx-auto">
              🔔
            </div>
            <h3 className="text-xl font-serif font-bold text-[#681F3B]">No notifications yet.</h3>
            <p className="text-xs text-[#75676E]">
              Activity updates and special date reminders will appear here as you interact in your space.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                  !item.read
                    ? 'bg-white border-[#C44569] shadow-sm'
                    : 'bg-[#FFF9F7] border-[#EADDE2] text-[#75676E]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-[#FFF1F4] flex items-center justify-center text-lg shrink-0">
                    {item.type === 'date' ? '📅' : item.type === 'memory' ? '📸' : item.type === 'love' ? '❤️' : '✨'}
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-[#681F3B]">
                      {item.title}
                    </p>
                    <p className="text-xs text-[#75676E] mt-0.5">{item.message}</p>
                    <p className="text-[10px] text-[#75676E] font-mono mt-1">{item.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
