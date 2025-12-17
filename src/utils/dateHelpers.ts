import { format, getDaysInMonth, startOfMonth, eachDayOfInterval, getDay } from 'date-fns';

const tamilDays = ['ஞாயிறு', 'திங்கள்', 'செவ்வாய்', 'புதன்', 'வியாழன்', 'வெள்ளி', 'சனி'];

export function getTamilDayName(date: Date): string {
  const dayIndex = getDay(date);
  return tamilDays[dayIndex];
}

export function formatDate(date: Date): string {
  return format(date, 'dd.MM.yyyy');
}

export function generateMonthDates(month: number, year: number): Date[] {
  const firstDay = startOfMonth(new Date(year, month - 1, 1));
  const lastDay = new Date(year, month - 1, getDaysInMonth(firstDay));
  return eachDayOfInterval({ start: firstDay, end: lastDay });
}

export function getMonthName(month: number): string {
  const months = [
    'ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்',
    'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்'
  ];
  return months[month - 1] || '';
}

