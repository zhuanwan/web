import React, { useState, useEffect, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import CalendarGrid from './CalendarGrid'
import EventModal from './EventModal'
import { getCalendarDays } from './lunarHelper'

// Simple ID generator
const generateId = () => Math.random().toString(36).substring(2, 9)

// Dropdown Data
const MONTHS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
const YEARS = Array.from({ length: 201 }, (_, i) => 1900 + i) // 1900 - 2100

// Hardcoded VIP Birthdays (Lunar Recurrent)
// Format: MM.DD (Lunar)
const VIP_BIRTHDAYS = [
  { name: '爸爸', date: '10.21' },
  { name: '妈妈', date: '01.19' },
  { name: '婆婆', date: '05.23' },
  { name: '小翊', date: '09.10' },
  { name: '小样', date: '02.17' },
  { name: '我', date: '02.02' },
  { name: '哥哥', date: '07.27' },
  { name: '姐姐', date: '06.11' },
]

// Convert to CalendarEvent objects
const PREDEFINED_EVENTS = VIP_BIRTHDAYS.map((vip, index) => {
  const [monthStr, dayStr] = vip.date.split('.')
  return {
    id: `static-vip-${index}`,
    title: `${vip.name}生日`,
    date: new Date().toISOString(),
    isLunarRecurrent: true,
    lunarMonth: parseInt(monthStr, 10),
    lunarDay: parseInt(dayStr, 10),
    color: 'bg-red-500', // Will serve as a base, but UI handles styling dynamically
  }
})

function App() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [events, setEvents] = useState([])

  // Load events from LocalStorage
  useEffect(() => {
    const stored = localStorage.getItem('lunar_calendar_events')
    if (stored) {
      try {
        setEvents(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse events', e)
      }
    }
  }, [])

  // Save events to LocalStorage
  useEffect(() => {
    localStorage.setItem('lunar_calendar_events', JSON.stringify(events))
  }, [events])

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const handleMonthChange = (e) => {
    const newMonth = parseInt(e.target.value, 10)
    setCurrentDate(new Date(currentDate.getFullYear(), newMonth, 1))
  }

  const handleYearChange = (e) => {
    const newYear = parseInt(e.target.value, 10)
    setCurrentDate(new Date(newYear, currentDate.getMonth(), 1))
  }

  const jumpToToday = () => {
    setCurrentDate(new Date())
  }

  const handleDayClick = (date) => {
    setSelectedDate(date)
    setIsModalOpen(true)
  }

  const handleSaveEvent = (eventData) => {
    const newEvent = {
      ...eventData,
      id: generateId(),
    }
    setEvents((prev) => [...prev, newEvent])
  }

  const handleDeleteEvent = (id) => {
    setEvents((prev) => prev.filter((e) => e.id !== id))
  }

  // Combine events
  const allEvents = useMemo(() => {
    return [...PREDEFINED_EVENTS, ...events]
  }, [events])

  const days = useMemo(() => {
    return getCalendarDays(currentDate.getFullYear(), currentDate.getMonth(), allEvents)
  }, [currentDate, allEvents])

  const eventsForSelectedDate = useMemo(() => {
    if (!selectedDate) return []
    return (
      days.find(
        (d) =>
          d.date.getDate() === selectedDate.getDate() &&
          d.date.getMonth() === selectedDate.getMonth() &&
          d.date.getFullYear() === selectedDate.getFullYear()
      )?.events || []
    )
  }, [selectedDate, days])

  return (
    <div className="min-h-screen flex flex-col bg-[#F2F2F7] text-[#1C1C1E]">
      {/* 
        iOS Style Glass Header 
        Sticky, Backdrop blur, clean separator
      */}

      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-black/5 px-6 py-4 transition-all duration-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Title & Date Controls */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
            <h1 className="text-3xl font-bold tracking-tight text-black">
              {currentDate.getFullYear()}年 {MONTHS[currentDate.getMonth()]}
            </h1>

            {/* Mobile Controls Group */}
            <div className="flex items-center gap-1 bg-gray-100/50 p-1 rounded-full md:hidden">
              <button onClick={prevMonth} className="p-2 text-blue-600 active:opacity-50 transition">
                <ChevronLeft size={24} />
              </button>
              <button onClick={nextMonth} className="p-2 text-blue-600 active:opacity-50 transition">
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

          {/* Right: Desktop Controls */}
          <div className="hidden md:flex items-center gap-4">
            {/* Year/Month Pickers - Minimalist */}
            <div className="flex items-center gap-2">
              <div className="relative group">
                <select
                  value={currentDate.getFullYear()}
                  onChange={handleYearChange}
                  className="appearance-none bg-transparent pl-2 pr-6 py-1 text-lg font-medium text-blue-600 cursor-pointer outline-none hover:opacity-70 transition"
                >
                  {YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y}年
                    </option>
                  ))}
                </select>
              </div>
              <div className="relative group">
                <select
                  value={currentDate.getMonth()}
                  onChange={handleMonthChange}
                  className="appearance-none bg-transparent pl-2 pr-6 py-1 text-lg font-medium text-blue-600 cursor-pointer outline-none hover:opacity-70 transition"
                >
                  {MONTHS.map((m, i) => (
                    <option key={m} value={i}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="h-6 w-px bg-gray-300 mx-2"></div>

            <div className="flex items-center gap-2">
              <button
                onClick={prevMonth}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition active:scale-95"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextMonth}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition active:scale-95"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <button
              onClick={jumpToToday}
              className="ml-2 px-4 py-1.5 text-sm font-semibold text-blue-600 bg-blue-50/50 hover:bg-blue-100 rounded-full transition active:scale-95"
            >
              回到今天
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 max-w-[1600px] mx-auto w-full flex flex-col">
        {/* Calendar Card: White, Rounded, Shadow-sm */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden flex-1 flex flex-col">
          <CalendarGrid days={days} onDayClick={handleDayClick} />
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs font-medium text-gray-400">Designed with Simplicity</p>
        </div>
      </main>

      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={selectedDate}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        existingEvents={eventsForSelectedDate}
      />
    </div>
  )
}

export default App
