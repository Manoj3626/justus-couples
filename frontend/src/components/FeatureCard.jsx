import React from 'react'

export default function FeatureCard({icon, title, children}){
  return (
    <div className="bg-white/90 rounded-2xl p-6 shadow-md max-w-sm border border-[#eadfe4]">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#F7DDE4] to-[#E98BA5] flex items-center justify-center text-xl shadow-sm">{icon}</div>
        <div>
          <h4 className="font-semibold text-[#2a1b27]">{title}</h4>
          <p className="text-sm text-[#5a3d4c] mt-1">{children}</p>
        </div>
      </div>
    </div>
  )
}
