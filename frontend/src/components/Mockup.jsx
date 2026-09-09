import React from 'react'

export default function Mockup(){
  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm text-secondary">Together for</div>
          <div className="text-2xl font-semibold">1 year</div>
        </div>
        <div className="text-sm text-secondary">Partner • Online</div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-[#FFF1F4] rounded-lg">
          <div className="text-xs text-secondary">Latest message</div>
          <div className="mt-2 font-medium">How was your day? ❤️</div>
        </div>
        <div className="p-4 bg-[#FFF1F4] rounded-lg">
          <div className="text-xs text-secondary">Listening to</div>
          <div className="mt-2 font-medium">Soft Evening — Our Playlist</div>
        </div>
        <div className="p-4 bg-[#FFF1F4] rounded-lg">
          <div className="text-xs text-secondary">Upcoming date</div>
          <div className="mt-2 font-medium">Movie Night — Sep 14</div>
        </div>
        <div className="p-4 bg-[#FFF1F4] rounded-lg">
          <div className="text-xs text-secondary">Latest memory</div>
          <div className="mt-2 font-medium">Beach Trip • 2026</div>
        </div>
      </div>
    </div>
  )
}
