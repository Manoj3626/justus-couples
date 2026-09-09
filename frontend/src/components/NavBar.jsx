import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function NavBar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('home')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const sections = ['home', 'features', 'how-it-works', 'experience', 'privacy', 'faq']
    const observers = []

    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActive(id)
            }
          })
        },
        { threshold: 0.3 }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  const scrollToSection = (e, id) => {
    e.preventDefault()
    setOpen(false)
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setActive('home')
      return
    }
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActive(id)
    }
  }

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'features', label: 'Features' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'experience', label: 'Experience' },
    { id: 'privacy', label: 'Privacy' },
    { id: 'faq', label: 'FAQ' },
  ]

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-[#FFF9F7]/90 backdrop-blur-md shadow-sm border-b border-[#EADDE2]'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-serif font-bold text-[#681F3B] hover:text-[#C44569] transition-colors"
        >
          justus.in <span className="text-[#C44569]">❤️</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#75676E]">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => scrollToSection(e, link.id)}
              className={`transition-colors duration-200 py-1 border-b-2 ${
                active === link.id
                  ? 'text-[#C44569] border-[#C44569] font-semibold'
                  : 'border-transparent hover:text-[#C44569]'
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/login"
            className="text-sm font-semibold text-[#681F3B] hover:text-[#C44569] transition-colors px-3 py-2"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="btn-primary text-sm px-5 py-2.5 inline-flex items-center gap-2"
          >
            <span>Create Your Space</span>
            <span>❤️</span>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          className="md:hidden p-2 rounded-xl text-[#681F3B] hover:bg-[#F7DDE4] transition-colors"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle Navigation Menu"
          aria-expanded={open}
        >
          {open ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile Drawer Menu */}
      {open && (
        <div className="md:hidden bg-[#FFF9F7] border-b border-[#EADDE2] px-6 py-6 animate-fadeIn shadow-lg">
          <div className="flex flex-col gap-4 text-base font-medium text-[#75676E]">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => scrollToSection(e, link.id)}
                className={`py-2 px-3 rounded-lg transition-colors ${
                  active === link.id
                    ? 'bg-[#F7DDE4] text-[#C44569] font-semibold'
                    : 'hover:bg-[#FFF1F4] hover:text-[#C44569]'
                }`}
              >
                {link.label}
              </a>
            ))}
            <hr className="border-[#EADDE2] my-2" />
            <div className="flex flex-col gap-3">
              <Link
                to="/signup"
                onClick={() => setOpen(false)}
                className="btn-primary text-center py-3 w-full"
              >
                Create Your Space ❤️
              </Link>
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="btn-secondary text-center py-3 w-full"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
