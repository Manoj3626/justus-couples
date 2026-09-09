import React from 'react'

export default function DatePlannerLandingSection() {
  const upcomingDates = [
    {
      title: 'Anniversary Dinner 🕯️',
      date: 'Friday, Sep 12 • 7:30 PM',
      location: 'The Rose Bistro',
      notes: 'Dress code: Formal elegant. Table reserved by the window.',
      countdown: '3 Days',
    },
    {
      title: 'Weekend Camping Trip ⛺',
      date: 'Saturday, Sep 20 • 9:00 AM',
      location: 'Pine Lake Valley',
      notes: 'Pack sleeping bags, marshmallows, and stargazing binoculars.',
      countdown: '11 Days',
    },
  ]

  return (
    <section id="date-planner" className="py-16 md:py-24 bg-[#FFF9F7]">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center">
        {/* Left Text */}
        <div className="lg:col-span-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#C44569] px-3 py-1 bg-[#F7DDE4] rounded-full">
            Couple Calendar
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#681F3B] mt-4">
            Make plans worth looking forward to.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#75676E] leading-relaxed">
            Plan dates, weekend getaways, anniversaries, and casual coffee runs together. Set shared reminders so neither of you ever forgets a moment.
          </p>

          <div className="mt-8 space-y-3 text-sm font-medium text-[#2B2025]">
            <p className="flex items-center gap-2">
              <span className="text-[#C44569]">✓</span> Joint monthly calendar & timeline
            </p>
            <p className="flex items-center gap-2">
              <span className="text-[#C44569]">✓</span> Automated countdown timers for upcoming dates
            </p>
            <p className="flex items-center gap-2">
              <span className="text-[#C44569]">✓</span> Location, activity notes & prep checklists
            </p>
          </div>
        </div>

        {/* Right Planner Calendar Preview */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADDE2] shadow-xl max-w-lg mx-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#EADDE2]">
              <div>
                <h4 className="font-serif font-bold text-lg text-[#681F3B]">September 2026</h4>
                <p className="text-xs text-[#75676E]">2 Dates Planned This Month</p>
              </div>
              <button className="px-3.5 py-1.5 rounded-xl bg-[#FFF1F4] text-[#C44569] text-xs font-semibold hover:bg-[#F7DDE4] transition-colors">
                + Add Date
              </button>
            </div>

            {/* Upcoming Date Cards List */}
            <div className="mt-6 space-y-4">
              {upcomingDates.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#FFF9F7] border border-[#EADDE2] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="font-serif font-bold text-sm text-[#681F3B]">{item.title}</h5>
                      <span className="text-[10px] font-bold text-[#C44569] bg-[#FFF1F4] px-2 py-0.5 rounded-full">
                        {item.countdown}
                      </span>
                    </div>
                    <p className="text-xs text-[#C44569] font-medium mt-1">{item.date}</p>
                    <p className="text-xs text-[#75676E] mt-0.5">📍 {item.location}</p>
                    <p className="text-[11px] text-[#75676E]/80 mt-1 italic">{item.notes}</p>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg bg-white border border-[#EADDE2] text-xs font-semibold text-[#681F3B] hover:border-[#C44569] shrink-0">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
