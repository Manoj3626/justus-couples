import React from 'react'

export default function LoadingSpinner(){
  return (
    <div className="flex items-center justify-center">
      <div className="w-10 h-10 rounded-full animate-spin border-4 border-[#E8DFE2] border-t-[#5B315D]"></div>
    </div>
  )
}
