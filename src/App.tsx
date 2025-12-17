import React, { useState, useMemo } from 'react';
import Filters from './components/Filters';
import ScheduleTable from './components/ScheduleTable';
import PDFDownload from './components/PDFDownload';
import { FilterState, ScheduleEntry, ScheduleData, Church } from './types/schedule';
import { generateMonthDates, formatDate, getTamilDayName } from './utils/dateHelpers';
import { getDay } from 'date-fns';
import churchesData from './data/churches.json';

const App: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    month: null,
    year: new Date().getFullYear(),
    place: null,
  });

  const selectedChurch = useMemo(() => {
    if (!filters.place) return null;
    return churchesData.churches.find((c) => c.id === filters.place) || null;
  }, [filters.place]);

  const [scheduleEntries, setScheduleEntries] = useState<ScheduleEntry[]>([]);

  // Generate schedule entries when month and place are selected
  // For Mallankinar and V.V.V. Nagar: Only Friday and Sunday
  // For other churches: Friday, Saturday, and Sunday
  React.useEffect(() => {
    if (filters.month && filters.place && filters.year) {
      const dates = generateMonthDates(filters.month, filters.year);
      const isMallankinar = filters.place === 'trinity-mallankinar';
      const isVVVNagar = filters.place === 'st-pauls-vvv';
      const isKulloor = filters.place === 'st-pauls-kulloor';
      const isMelathulukankulam = filters.place === 'jesusnathar-melathulukankulam';
      
      // Filter dates based on church
      const filteredDates = dates.filter((date) => {
        const dayOfWeek = getDay(date);
        if (isMallankinar || isVVVNagar) {
          // Only Friday and Sunday for these churches
          return dayOfWeek === 0 || dayOfWeek === 5; // Sunday, Friday
        } else if (isKulloor || isMelathulukankulam) {
          // Only Sunday for these churches
          return dayOfWeek === 0; // Sunday only
        } else {
          // Friday, Saturday, Sunday for other churches
          return dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6;
        }
      });

      // Generate entries with pre-filled data for specific churches
      const entries: ScheduleEntry[] = [];
      
      filteredDates.forEach((date) => {
        const dayOfWeek = getDay(date);
        const dateStr = formatDate(date);
        const dayName = getTamilDayName(date);

        if (isMallankinar) {
          if (dayOfWeek === 5) {
            // Friday: Evening 7:00 PM - Women's Meeting
            entries.push({
              date: dateStr,
              day: dayName,
              time: 'மாலை 7.00மணி',
              serviceType: 'பெண்கள் கூடுகை',
              speaker: '',
            });
          } else if (dayOfWeek === 0) {
            // Sunday: Morning service and Youth meeting
            entries.push({
              date: dateStr,
              day: dayName,
              time: 'காலை 10 மணி',
              serviceType: 'ஞாயிறு ஆராதனை',
              speaker: '',
            });
            entries.push({
              date: dateStr,
              day: dayName,
              time: 'மதியம் 12 மணி',
              serviceType: 'வாலிபர் கூடுகை',
              speaker: '',
            });
          }
        } else if (isVVVNagar) {
          if (dayOfWeek === 5) {
            // Friday: Evening 7:00 PM - Evening Worship
            entries.push({
              date: dateStr,
              day: dayName,
              time: 'மாலை 7.00மணி',
              serviceType: 'மாலை ஆராதனை',
              speaker: '',
            });
          } else if (dayOfWeek === 0) {
            // Sunday: Morning service and Youth meeting
            entries.push({
              date: dateStr,
              day: dayName,
              time: 'காலை 8.30 மணி',
              serviceType: 'ஞாயிறு ஆராதனை',
              speaker: '',
            });
            entries.push({
              date: dateStr,
              day: dayName,
              time: 'மதியம் 12 மணி',
              serviceType: 'வாலிபர் கூடுகை',
              speaker: '',
            });
          }
        } else if (isKulloor) {
          // Kulloor Santhai: Only Sunday at 9:30 AM
          if (dayOfWeek === 0) {
            entries.push({
              date: dateStr,
              day: dayName,
              time: 'காலை 9.30 மணி',
              serviceType: 'ஞாயிறு ஆராதனை',
              speaker: '',
            });
          }
        } else if (isMelathulukankulam) {
          // Melathulukankulam: Only Sunday at 10:00 AM
          if (dayOfWeek === 0) {
            entries.push({
              date: dateStr,
              day: dayName,
              time: 'காலை 10 மணி',
              serviceType: 'ஞாயிறு ஆராதனை',
              speaker: '',
            });
          }
        } else {
          // Other churches: empty entries
          entries.push({
            date: dateStr,
            day: dayName,
            time: '',
            serviceType: '',
            speaker: '',
          });
        }
      });

      setScheduleEntries(entries);
    } else {
      setScheduleEntries([]);
    }
  }, [filters.month, filters.place, filters.year]);

  // Group entries by date for easier manipulation
  const groupedByDate = useMemo(() => {
    const groups = new Map<string, ScheduleEntry[]>();
    scheduleEntries.forEach((entry) => {
      if (!groups.has(entry.date)) {
        groups.set(entry.date, []);
      }
      groups.get(entry.date)!.push(entry);
    });
    return groups;
  }, [scheduleEntries]);

  const handleEntryChange = (dateIndex: number, serviceIndex: number, field: 'time' | 'serviceType' | 'speaker', value: string) => {
    const updated = [...scheduleEntries];
    const dateKeys = Array.from(groupedByDate.keys());
    const targetDate = dateKeys[dateIndex];
    const entriesForDate = groupedByDate.get(targetDate) || [];
    
    // Find the index in the full array
    let currentIndex = 0;
    for (let i = 0; i < dateIndex; i++) {
      currentIndex += groupedByDate.get(dateKeys[i])?.length || 0;
    }
    currentIndex += serviceIndex;
    
    if (updated[currentIndex]) {
      updated[currentIndex] = { ...updated[currentIndex], [field]: value };
      setScheduleEntries(updated);
    }
  };

  const handleDateChange = (dateIndex: number, date: string, day: string) => {
    const updated = [...scheduleEntries];
    const dateKeys = Array.from(groupedByDate.keys());
    const targetDate = dateKeys[dateIndex];
    const entriesForDate = groupedByDate.get(targetDate) || [];
    
    // Update all entries with the same date
    entriesForDate.forEach((entry) => {
      const index = updated.findIndex((e) => e.date === targetDate && e.time === entry.time);
      if (index !== -1) {
        updated[index] = { ...updated[index], date, day };
      }
    });
    
    setScheduleEntries(updated);
  };

  const scheduleData: ScheduleData | null = useMemo(() => {
    if (!filters.month || !filters.place || scheduleEntries.length === 0) {
      return null;
    }
    return {
      churchId: filters.place,
      month: filters.month,
      year: filters.year,
      entries: scheduleEntries,
    };
  }, [filters, scheduleEntries]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>தேவாலய ஆராதனை அட்டவணை</h1>
      <Filters filters={filters} onFiltersChange={setFilters} />

      {selectedChurch && scheduleEntries.length > 0 && (
        <>
          <ScheduleTable
            church={selectedChurch}
            entries={scheduleEntries}
            onEntryChange={handleEntryChange}
            onDateChange={handleDateChange}
          />
          {scheduleData && (
            <PDFDownload scheduleData={scheduleData} church={selectedChurch} />
          )}
        </>
      )}

      {filters.month && !filters.place && (
        <div style={styles.message}>
          தயவுசெய்து இடத்தைத் தேர்ந்தெடுக்கவும்
        </div>
      )}

      {!filters.month && (
        <div style={styles.message}>
          தயவுசெய்து மாதத்தைத் தேர்ந்தெடுக்கவும்
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '30px',
    fontSize: '28px',
  },
  message: {
    textAlign: 'center',
    padding: '40px',
    color: '#666',
    fontSize: '18px',
  },
};

export default App;

