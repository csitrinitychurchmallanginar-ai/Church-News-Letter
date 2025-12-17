import express from 'express';
import puppeteer from 'puppeteer';
import { ScheduleData, Church } from '../types.js';

const router = express.Router();

router.post('/generate-pdf', async (req, res) => {
  let browser;
  try {
    const { church, scheduleData }: { church: Church; scheduleData: ScheduleData } = req.body;

    if (!church || !scheduleData) {
      return res.status(400).json({ error: 'Missing church or schedule data' });
    }

    if (!scheduleData.entries || scheduleData.entries.length === 0) {
      return res.status(400).json({ error: 'No schedule entries to generate PDF' });
    }

    // Generate HTML content
    const htmlContent = generateHTML(church, scheduleData);

    // Launch Puppeteer with timeout
    // Use the new Headless mode to avoid deprecation warnings
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
      ],
      timeout: 30000,
    });

    const page = await browser.newPage();
    
    // Set content with timeout
    await page.setContent(htmlContent, { 
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    // Wait for fonts to load
    await page.evaluateHandle(() => document.fonts.ready);

    // Generate PDF
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm',
      },
      timeout: 30000,
    });

    await browser.close();
    browser = null;

    // Generate filename with place name and month
    const monthNames = [
      'ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்',
      'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்'
    ];
    const monthName = monthNames[scheduleData.month - 1] || `Month${scheduleData.month}`;
    const placeName = church.location || 'Place';
    const filename = `${placeName}_${monthName}_${scheduleData.year}.pdf`.replace(/[^a-zA-Z0-9._\u0B80-\u0BFF-]/g, '_');
    
    // Send PDF as response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
    res.send(pdf);
  } catch (error: any) {
    console.error('Error generating PDF:', error);
    
    // Close browser if it's still open
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error('Error closing browser:', closeError);
      }
    }

    const errorMessage = error?.message || 'Failed to generate PDF';
    res.status(500).json({ 
      error: 'Failed to generate PDF',
      details: errorMessage,
    });
  }
});

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

function generateHTML(church: Church, scheduleData: ScheduleData): string {
  // Group entries by date
  const groupedByDate = new Map<string, typeof scheduleData.entries>();
  scheduleData.entries.forEach((entry) => {
    if (!groupedByDate.has(entry.date)) {
      groupedByDate.set(entry.date, []);
    }
    groupedByDate.get(entry.date)!.push(entry);
  });

  const dateKeys = Array.from(groupedByDate.keys());
  let tableRows = '';

  dateKeys.forEach((date) => {
    const entries = groupedByDate.get(date)!;
    const rowSpan = entries.length;

    entries.forEach((entry, index) => {
      const escapedDate = escapeHtml(entry.date);
      const escapedDay = escapeHtml(entry.day);
      const escapedTime = escapeHtml(entry.time || '');
      const escapedServiceType = escapeHtml(entry.serviceType || '');
      const escapedSpeaker = escapeHtml(entry.speaker || '');

      if (index === 0) {
        // First row: include date cell with rowspan
        tableRows += `
    <tr>
      <td rowspan="${rowSpan}" style="border: 1px solid #000; padding: 8px; vertical-align: top;">${escapedDate} (${escapedDay})</td>
      <td style="border: 1px solid #000; padding: 8px;">${escapedTime}</td>
      <td colspan="2" style="border: 1px solid #000; padding: 8px;">
        <div style="margin-bottom: 4px;">${escapedServiceType}</div>
        <div>${escapedSpeaker}</div>
      </td>
    </tr>`;
      } else {
        // Subsequent rows: no date cell
        tableRows += `
    <tr>
      <td style="border: 1px solid #000; padding: 8px;">${escapedTime}</td>
      <td colspan="2" style="border: 1px solid #000; padding: 8px;">
        <div style="margin-bottom: 4px;">${escapedServiceType}</div>
        <div>${escapedSpeaker}</div>
      </td>
    </tr>`;
      }
    });
  });

  const escapedChurchName = escapeHtml(church.name);
  const escapedLocation = escapeHtml(church.location);

  return `
<!DOCTYPE html>
<html lang="ta">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapedChurchName}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@400;700&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Noto Sans Tamil', Arial, sans-serif;
      padding: 20px;
      background: white;
    }
    
    .header {
      background-color: #000;
      color: #fff;
      padding: 15px;
      text-align: center;
      font-weight: bold;
      font-size: 18px;
      margin-bottom: 0;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      border: 2px solid #000;
      margin-top: 0;
    }
    
    th {
      border: 1px solid #000;
      padding: 12px;
      background-color: #f0f0f0;
      font-weight: bold;
      text-align: left;
      font-size: 14px;
    }
    
    td {
      border: 1px solid #000;
      padding: 8px;
      font-size: 14px;
    }
    
    tr:nth-child(even) {
      background-color: #fafafa;
    }
  </style>
</head>
<body>
  <div class="header">${escapedChurchName}, ${escapedLocation}</div>
  <table>
    <thead>
      <tr>
        <th>தேதி / நாள்</th>
        <th>நேரம்</th>
        <th colspan="2">ஆராதனை / நிகழ்வு மற்றும் பேச்சாளர் / தலைவர்</th>
      </tr>
    </thead>
    <tbody>
      ${tableRows}
    </tbody>
  </table>
</body>
</html>
  `;
}

export default router;

