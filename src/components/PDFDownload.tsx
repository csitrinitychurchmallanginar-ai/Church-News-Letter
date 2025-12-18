import React, { useState } from 'react';
import { ScheduleData, Church } from '../types/schedule';
import { getApiUrl } from '../config';

interface PDFDownloadProps {
  scheduleData: ScheduleData;
  church: Church;
}

const PDFDownload: React.FC<PDFDownloadProps> = ({ scheduleData, church }) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/api/generate-pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          church,
          scheduleData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || errorData.details || 'PDF generation failed');
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        // Error response
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.details || 'PDF generation failed');
      }

      const blob = await response.blob();

      if (blob.size === 0) {
        throw new Error('Empty PDF file received');
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      // Generate filename with place name and Tamil month name
      const monthNames = [
        'ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்',
        'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்'
      ];
      const monthName = monthNames[scheduleData.month - 1] || `Month${scheduleData.month}`;
      const placeName = church.location || 'Place';
      const filename = `${placeName}_${monthName}_${scheduleData.year}.pdf`;

      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      console.error('Error generating PDF:', error);
      const errorMessage = error?.message || 'PDF பதிவிறக்கம் தோல்வியடைந்தது. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <button
        onClick={handleDownload}
        disabled={loading || scheduleData.entries.length === 0}
        style={{
          ...styles.button,
          opacity: loading || scheduleData.entries.length === 0 ? 0.6 : 1,
          cursor: loading || scheduleData.entries.length === 0 ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'PDF உருவாக்குகிறது...' : 'PDF பதிவிறக்க'}
      </button>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    padding: '20px',
  },
  button: {
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: 'bold',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};

export default PDFDownload;

