import React, { useEffect, useState } from 'react'

// Glob all images under /src/assets/images at build time
const modules = import.meta.glob('/src/assets/images/**/*.{png,jpg,jpeg,webp,svg,avif}', { eager: true, query: '?url', import: 'default' })

const imagesByFolder = Object.entries(modules).reduce((acc,[path,url])=>{
  const parts = path.split('/')
  const folder = parts[parts.length-2] || 'general'
  acc[folder] = acc[folder] || []
  acc[folder].push({ path, url })
  return acc
},{})

async function scoreImages(list, desiredRatio){
  // returns url of best image by visible area and ratio closeness
  if(!list || list.length===0) return null
  if(list.length===1) return list[0].url

  const results = await Promise.all(list.map(item=>{
    return new Promise(resolve=>{
      const img = new Image()
      img.onload = ()=>{
        const w = img.naturalWidth || 1
        const h = img.naturalHeight || 1
        const area = w * h
        const ratio = w / h
        const ratioDiff = Math.abs(ratio - desiredRatio) / Math.max(desiredRatio, ratio)
        const score = area * (1 - Math.min(0.5, ratioDiff))
        resolve({ url: item.url, score })
      }
      img.onerror = ()=> resolve({ url: item.url, score: 0 })
      img.src = item.url
    })
  }))

  results.sort((a,b)=>b.score - a.score)
  return results[0].url
}

export default function CoupleImage({ folder='general', alt='', className='', aspect='16/9', overlay=false, eager=false, style={} }){
  const list = imagesByFolder[folder] || []
  const [chosen, setChosen] = useState(null)

  useEffect(()=>{
    let mounted = true
    const parts = String(aspect).split('/').map(Number)
    const desiredRatio = parts.length===2 && parts[1] ? (parts[0]/parts[1]) : 16/9

    if(list.length===0){
      setChosen(null)
      return
    }

    // pick best image by loading and scoring
    scoreImages(list, desiredRatio).then(url=>{
      if(mounted) setChosen(url)
    }).catch(()=>{
      if(mounted) setChosen(list[0].url)
    })

    return ()=> mounted = false
  }, [folder, aspect])

  const wrapperStyle = Object.assign({ position: 'relative', overflow: 'hidden', borderRadius: '12px' }, style)

  if(!chosen){
    // graceful placeholder
    return (
      <div style={wrapperStyle} className={"bg-gradient-to-br from-rose-50 to-white " + className}>
        <div className="flex items-center justify-center p-8 h-full">
          <div className="text-center text-secondary">
            <div className="text-4xl">💕</div>
            <div className="mt-2 font-medium">Beautiful moments, coming soon</div>
            <div className="mt-1 text-sm">Add images to /src/assets/images/{folder} to replace this</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ ...wrapperStyle }} className={className}>
      <img src={chosen} alt={alt} loading={eager? 'eager':'lazy'} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
      {overlay && <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg, rgba(196,69,105,0.08), rgba(233,139,165,0.06))' }} aria-hidden />}
    </div>
  )
}
