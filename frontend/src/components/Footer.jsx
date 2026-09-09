import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  const scrollToAnchor = (e, id) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <footer className="bg-[#FFF9F7] border-t border-[#EADDE2] pt-16 pb-12 text-[#75676E]">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-10">
        {/* Left Column Brand */}
        <div className="col-span-2">
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-serif font-bold text-[#681F3B]"
          >
            JustUs <span className="text-[#C44569]">❤️</span>
          </Link>
          <p className="mt-3 text-sm text-[#75676E] max-w-sm">
            "Two people. One private space."
          </p>
          <p className="mt-4 text-xs text-[#75676E]/80">
            A premium private platform crafted for couples to chat, play games, listen, watch, and store cherished memories together.
          </p>

          {/* Contact Placeholders */}
          <div className="mt-6 space-y-1.5 text-xs text-[#2B2025] font-medium">
            <p>📧 support@justus.in</p>
            <p>📞 +91 XXXXX XXXXX</p>
            <p>📍 India</p>
          </div>
        </div>

        {/* Column 1: Product */}
        <div>
          <h4 className="font-serif font-bold text-[#681F3B] text-base mb-4">Product</h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <a href="#features" onClick={(e) => scrollToAnchor(e, 'features')} className="hover:text-[#C44569]">
                Features
              </a>
            </li>
            <li>
              <a href="#chat" onClick={(e) => scrollToAnchor(e, 'chat')} className="hover:text-[#C44569]">
                Private Chat
              </a>
            </li>
            <li>
              <a href="#games" onClick={(e) => scrollToAnchor(e, 'games')} className="hover:text-[#C44569]">
                Couple Games
              </a>
            </li>
            <li>
              <a href="#music" onClick={(e) => scrollToAnchor(e, 'music')} className="hover:text-[#C44569]">
                Shared Music
              </a>
            </li>
            <li>
              <a href="#watch" onClick={(e) => scrollToAnchor(e, 'watch')} className="hover:text-[#C44569]">
                Watch Together
              </a>
            </li>
            <li>
              <a href="#memories" onClick={(e) => scrollToAnchor(e, 'memories')} className="hover:text-[#C44569]">
                Memories
              </a>
            </li>
            <li>
              <a href="#date-planner" onClick={(e) => scrollToAnchor(e, 'date-planner')} className="hover:text-[#C44569]">
                Date Planner
              </a>
            </li>
          </ul>
        </div>

        {/* Column 2: Company */}
        <div>
          <h4 className="font-serif font-bold text-[#681F3B] text-base mb-4">Company</h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <a href="#why-justus" onClick={(e) => scrollToAnchor(e, 'why-justus')} className="hover:text-[#C44569]">
                About JustUs
              </a>
            </li>
            <li>
              <a href="#privacy" onClick={(e) => scrollToAnchor(e, 'privacy')} className="hover:text-[#C44569]">
                Contact Support
              </a>
            </li>
            <li>
              <Link to="/signup" className="hover:text-[#C44569]">
                Create Space
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Legal & Support */}
        <div>
          <h4 className="font-serif font-bold text-[#681F3B] text-base mb-4">Legal & Help</h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <a href="#privacy" onClick={(e) => scrollToAnchor(e, 'privacy')} className="hover:text-[#C44569]">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#privacy" onClick={(e) => scrollToAnchor(e, 'privacy')} className="hover:text-[#C44569]">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#faq" onClick={(e) => scrollToAnchor(e, 'faq')} className="hover:text-[#C44569]">
                Help Center
              </a>
            </li>
            <li>
              <a href="#faq" onClick={(e) => scrollToAnchor(e, 'faq')} className="hover:text-[#C44569]">
                FAQ
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-[#EADDE2] flex flex-col sm:flex-row items-center justify-between text-xs text-[#75676E] gap-4">
        <p>© 2026 JustUs (justus.in). All rights reserved.</p>
        <p className="font-semibold text-[#681F3B] flex items-center gap-1">
          Made with <span className="text-[#C44569]">❤️</span> for two.
        </p>
      </div>
    </footer>
  )
}
