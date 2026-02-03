import React, { useMemo } from 'react';
import CalendarGrid from './CalendarGrid';
import { getCalendarDays } from './lunarHelper';

const MONTHS = Array.from({ length: 12 });

export default function YearView({ year, events, onDayClick }) {
  const monthsData = useMemo(() => {
    return MONTHS.map((_, month) => ({
      month,
      days: getCalendarDays(year, month, events),
    }));
  }, [year, events]);

  return (
    <div
      id="print-area"
      className="
        grid grid-cols-3 gap-6 p-8 bg-white
        print:grid-cols-3 print:gap-4 print:p-4
      "
    >
      {monthsData.map(({ month, days }) => (
        <div
          key={month}
          className="
            border border-gray-300 rounded-xl overflow-hidden
            print:border-gray-400
          "
        >
          <div className="text-center py-2 font-bold text-lg bg-gray-50 border-b">
            {year} 年 {month + 1} 月
          </div>

          <CalendarGrid days={days} onDayClick={onDayClick} small />
        </div>
      ))}
    </div>
  );
}
