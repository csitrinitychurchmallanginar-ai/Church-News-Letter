import React from 'react';
import { FilterState } from '../types/schedule';
import { getMonthName } from '../utils/dateHelpers';
import churchesData from '../data/churches.json';

interface FiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const Filters: React.FC<FiltersProps> = ({ filters, onFiltersChange }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const handleMonthChange = (month: number) => {
    onFiltersChange({
      ...filters,
      month,
      place: null, // Reset place when month changes
    });
  };

  const handleYearChange = (year: number) => {
    onFiltersChange({
      ...filters,
      year,
    });
  };

  const handlePlaceChange = (placeId: string) => {
    onFiltersChange({
      ...filters,
      place: placeId,
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.filterGroup}>
        <label style={styles.label}>மாதம் (Month):</label>
        <select
          value={filters.month || ''}
          onChange={(e) => handleMonthChange(Number(e.target.value))}
          style={styles.select}
        >
          <option value="">மாதத்தைத் தேர்ந்தெடுக்கவும்</option>
          {months.map((month) => (
            <option key={month} value={month}>
              {getMonthName(month)} ({month})
            </option>
          ))}
        </select>
      </div>

      <div style={styles.filterGroup}>
        <label style={styles.label}>ஆண்டு (Year):</label>
        <select
          value={filters.year}
          onChange={(e) => handleYearChange(Number(e.target.value))}
          style={styles.select}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.filterGroup}>
        <label style={styles.label}>இடம் (Place):</label>
        <select
          value={filters.place || ''}
          onChange={(e) => handlePlaceChange(e.target.value)}
          disabled={!filters.month}
          style={{
            ...styles.select,
            opacity: filters.month ? 1 : 0.5,
            cursor: filters.month ? 'pointer' : 'not-allowed',
          }}
        >
          <option value="">இடத்தைத் தேர்ந்தெடுக்கவும்</option>
          {churchesData.churches.map((church) => (
            <option key={church.id} value={church.id}>
              {church.name} - {church.location}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    gap: '20px',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    minWidth: '200px',
  },
  label: {
    fontWeight: 'bold',
    fontSize: '14px',
    color: '#333',
  },
  select: {
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: 'white',
  },
};

export default Filters;

