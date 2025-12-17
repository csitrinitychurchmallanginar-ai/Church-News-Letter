import React, { useMemo } from 'react';
import { ScheduleEntry, Church, GroupedScheduleEntry } from '../types/schedule';

interface ScheduleTableProps {
  church: Church;
  entries: ScheduleEntry[];
  onEntryChange: (dateIndex: number, serviceIndex: number, field: 'time' | 'serviceType' | 'speaker', value: string) => void;
  onDateChange: (dateIndex: number, date: string, day: string) => void;
}

const ScheduleTable: React.FC<ScheduleTableProps> = ({ church, entries, onEntryChange, onDateChange }) => {
  // Group entries by date
  const groupedEntries = useMemo(() => {
    const grouped: GroupedScheduleEntry[] = [];
    const dateMap = new Map<string, GroupedScheduleEntry>();

    entries.forEach((entry) => {
      if (!dateMap.has(entry.date)) {
        const groupedEntry: GroupedScheduleEntry = {
          date: entry.date,
          day: entry.day,
          services: [],
        };
        dateMap.set(entry.date, groupedEntry);
        grouped.push(groupedEntry);
      }
      const groupedEntry = dateMap.get(entry.date)!;
      groupedEntry.services.push({
        time: entry.time,
        serviceType: entry.serviceType,
        speaker: entry.speaker,
      });
    });

    return grouped;
  }, [entries]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        {church.name}, {church.location}
      </div>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>தேதி / நாள்</th>
            <th style={styles.th}>நேரம்</th>
            <th style={styles.th} colSpan={2}>ஆராதனை / நிகழ்வு மற்றும் பேச்சாளர் / தலைவர்</th>
          </tr>
        </thead>
        <tbody>
          {groupedEntries.map((groupedEntry, dateIndex) => (
            <React.Fragment key={groupedEntry.date}>
              {groupedEntry.services.map((service, serviceIndex) => (
                <tr key={`${groupedEntry.date}-${serviceIndex}`}>
                  {serviceIndex === 0 && (
                    <td
                      rowSpan={groupedEntry.services.length}
                      style={styles.td}
                    >
                      <input
                        type="text"
                        value={`${groupedEntry.date} (${groupedEntry.day})`}
                        onChange={(e) => {
                          const parts = e.target.value.split(' ');
                          const date = parts[0];
                          const day = parts[1]?.replace(/[()]/g, '') || '';
                          onDateChange(dateIndex, date, day);
                        }}
                        style={styles.input}
                      />
                    </td>
                  )}
                  <td style={styles.td}>
                    <input
                      type="text"
                      value={service.time}
                      onChange={(e) => onEntryChange(dateIndex, serviceIndex, 'time', e.target.value)}
                      style={styles.input}
                      placeholder="காலை 10 மணி"
                    />
                  </td>
                  <td colSpan={2} style={styles.td}>
                    <div style={styles.mergedCell}>
                      <input
                        type="text"
                        value={service.serviceType}
                        onChange={(e) => onEntryChange(dateIndex, serviceIndex, 'serviceType', e.target.value)}
                        style={{ ...styles.input, marginBottom: '4px' }}
                        placeholder="ஞாயிறு ஆராதனை"
                      />
                      <input
                        type="text"
                        value={service.speaker}
                        onChange={(e) => onEntryChange(dateIndex, serviceIndex, 'speaker', e.target.value)}
                        style={styles.input}
                        placeholder="Mr. பெயர்"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    marginBottom: '30px',
  },
  header: {
    backgroundColor: '#000',
    color: '#fff',
    padding: '15px',
    fontSize: '18px',
    fontWeight: 'bold',
    textAlign: 'center',
    borderRadius: '4px 4px 0 0',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    border: '2px solid #000',
    backgroundColor: '#fff',
  },
  th: {
    border: '1px solid #000',
    padding: '12px',
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
    textAlign: 'left',
    fontSize: '14px',
  },
  td: {
    border: '1px solid #000',
    padding: '8px',
  },
  input: {
    width: '100%',
    padding: '8px',
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    fontFamily: 'inherit',
    backgroundColor: 'transparent',
  },
  mergedCell: {
    display: 'flex',
    flexDirection: 'column',
  },
};

export default ScheduleTable;

