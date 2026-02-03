import { Solar, Lunar, HolidayUtil } from 'lunar-javascript';

export const getCalendarDays = (
  year,
  month, // 0-indexed (0 = Jan)
  events
) => {
  const days= [];
  
  // First day of the month
  const firstDayOfMonth = new Date(year, month, 1);
  const startDayOfWeek = firstDayOfMonth.getDay(); // 0 (Sun) - 6 (Sat)
  
  // Calculate days from previous month to fill grid
  // We want Monday to be the start (Index 0)
  // If startDayOfWeek is 1 (Monday) -> offset is 0
  // If startDayOfWeek is 0 (Sunday) -> offset is 6
  const mondayBasedOffset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

  const startDate = new Date(year, month, 1 - mondayBasedOffset);
  
  // We generally show 6 weeks (42 days) to cover all possibilities
  const totalDays = 42;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < totalDays; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    
    // Core conversion using lunar-javascript
    const solar = Solar.fromYmd(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      currentDate.getDate()
    );
    const lunar = solar.getLunar();

    // Check for festivals and solar terms
    let festival = '';
    const festivals = HolidayUtil.getHolidays(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate());
    
    // Prioritize Lunar Festivals first, then Solar Terms
    const lunarFestivals = lunar.getFestivals();
    const solarTerms = lunar.getJieQi();

    if (lunarFestivals.length > 0) {
        festival = lunarFestivals[0]; // e.g., "春节"
    } else if (solarTerms) {
        festival = solarTerms; // e.g., "清明"
    } else {
       // Check for common holidays if no lunar festival
       const solarFestivals = solar.getFestivals();
        if (solarFestivals.length > 0) {
            festival = solarFestivals[0];
        }
    }

    // Process Events for this day
    const dayEvents = events.filter(event => {
      if (event.isLunarRecurrent) {
        // Match Lunar Month and Day
        return event.lunarMonth === lunar.getMonth() && event.lunarDay === lunar.getDay();
      } else {
        // Match exact Gregorian date
        const eventDate = new Date(event.date);
        eventDate.setHours(0,0,0,0);
        return eventDate.getTime() === currentDate.getTime();
      }
    });

    days.push({
      date: currentDate,
      isCurrentMonth: currentDate.getMonth() === month,
      isToday: currentDate.getTime() === today.getTime(),
      lunarDayStr: lunar.getDayInChinese(),
      lunarMonthStr: lunar.getMonthInChinese(),
      term: solarTerms || undefined,
      festival: festival || undefined,
      events: dayEvents,
    });
  }

  return days;
};

export const getLunarDetails = (date) => {
  const solar = Solar.fromDate(date);
  const lunar = solar.getLunar();
  return {
    lunarMonth: lunar.getMonth(),
    lunarDay: lunar.getDay(),
    lunarMonthStr: lunar.getMonthInChinese(),
    lunarDayStr: lunar.getDayInChinese(),
    ganZhiYear: lunar.getYearInGanZhi(),
    zodiac: lunar.getYearShengXiao(),
  };
};

// Helper to format a date nicely
export const formatFullDate = (date) => {
  return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
};