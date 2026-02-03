import React from 'react'
import { twMerge } from 'tailwind-merge'

const WEEKDAYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

const CalendarGrid = ({ days, onDayClick, small = false }) => {
  return (
    <div className="w-full flex flex-col bg-white overflow-hidden">
      {/* Week Header */}
      <div className="grid grid-cols-7 border-b border-[#e5e5e5]">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className={twMerge(
              small
                ? 'py-1 text-center text-[9px] font-semibold tracking-wide text-[#9ca3af]'
                : 'py-4 text-center text-[11px] font-semibold uppercase tracking-widest text-[#9ca3af]'
            )}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 flex-1 auto-rows-fr">
        {days.map((day, index) => {
          let subLabel = day.lunarDayStr
          let subLabelClass = 'text-[#9ca3af]'

          if (day.festival) {
            subLabel = day.festival
            subLabelClass = 'text-[#007AFF] font-medium'
          } else if (day.term) {
            subLabel = day.term
            subLabelClass = 'text-[#FF3B30] font-medium'
          } else if (day.lunarDayStr === '初一') {
            subLabel = `${day.lunarMonthStr}月`
            subLabelClass = 'text-[#111827] font-medium'
          }

          const birthdays = day.events.filter((e) => e.isLunarRecurrent)
          const otherEvents = day.events.filter((e) => !e.isLunarRecurrent)

          return (
            <div
              key={index}
              onClick={() => onDayClick(day.date)}
              className={twMerge(
                small
                  ? 'relative p-1 min-h-[72px] cursor-pointer border-b border-r border-[#e5e5e5] flex flex-col gap-0.5 overflow-hidden'
                  : 'relative p-2 min-h-[110px] cursor-pointer transition-colors duration-200 border-b border-r border-[#e5e5e5] flex flex-col gap-1',
                !day.isCurrentMonth && 'bg-[#fafafa]',
                !small && day.isCurrentMonth && 'hover:bg-[#f5f5f5]',
                index % 7 === 6 && 'border-r-0'
              )}
            >
              {/* Date + Lunar */}
              <div className="flex justify-between items-start px-1 pt-1">
                <span
                  className={twMerge(
                    small
                      ? 'text-[11px] font-medium w-5 h-5 flex items-center justify-center rounded-full'
                      : 'text-[15px] font-medium w-8 h-8 flex items-center justify-center rounded-full',
                    day.isCurrentMonth ? 'text-[#1C1C1E]' : 'text-[#d1d5db]'
                  )}
                >
                  {day.date.getDate()}
                </span>

                <span className={twMerge(small ? 'text-[8px] mt-0.5' : 'text-[10px] mt-1.5', subLabelClass)}>
                  {subLabel}
                </span>
              </div>

              {/* Events */}
              <div className="flex flex-col gap-1 mt-1 px-1">
                {birthdays.map((evt) => (
                  <div
                    key={evt.id}
                    className={twMerge(
                      small
                        ? 'flex flex-row items-center gap-1 px-1 leading-none'
                        : 'flex flex-row items-center gap-1 px-2 py-0.5 rounded-md bg-[#ffeaea] border border-[#ffd6d6]'
                    )}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FF3B30] shrink-0" />
                    <span
                      className={twMerge(
                        'font-medium truncate min-h-3',
                        small ? 'text-[9px] text-[#b91c1c]' : 'text-[10px] text-[#b91c1c]'
                      )}
                    >
                      {evt.title}
                    </span>
                  </div>
                ))}

                {otherEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className={twMerge(
                      small
                        ? 'flex items-center gap-1 px-1 leading-none'
                        : 'flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#eaf3ff] border border-[#d6e9ff]'
                    )}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#007AFF] shrink-0" />
                    <span
                      className={twMerge(
                        'font-medium truncate',
                        small ? 'text-[9px] text-[#1d4ed8]' : 'text-[10px] text-[#1d4ed8]'
                      )}
                    >
                      {evt.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CalendarGrid
