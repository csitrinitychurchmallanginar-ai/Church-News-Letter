import { format, getDaysInMonth, startOfMonth, eachDayOfInterval, getDay } from 'date-fns';

// Tamil day names
const tamilDays = ['ஞாயிறு', 'திங்கள்', 'செவ்வாய்', 'புதன்', 'வியாழன்', 'வெள்ளி', 'சனி'];

// Tamil time notations
export const tamilTimeNotations = {
  morning: 'காலை',
  afternoon: 'மதியம்',
  evening: 'மாலை'
};

export function formatDateTamil(date: Date): string {
  return format(date, 'dd.MM.yyyy');
}

export function getTamilDayName(date: Date): string {
  const dayIndex = getDay(date);
  return tamilDays[dayIndex];
}

export function generateMonthDates(month: number, year: number): Array<{ date: Date; dateStr: string; day: string }> {
  const startDate = startOfMonth(new Date(year, month - 1));
  const daysInMonth = getDaysInMonth(startDate);
  const endDate = new Date(year, month - 1, daysInMonth);
  
  const dates = eachDayOfInterval({ start: startDate, end: endDate });
  
  return dates.map(date => ({
    date,
    dateStr: formatDateTamil(date),
    day: getTamilDayName(date)
  }));
}

export function getMonthName(month: number): string {
  const monthNames = [
    'ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்',
    'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்'
  ];
  return monthNames[month - 1] || '';
}
