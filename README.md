# Church Schedule PDF Generator

A web application for creating and downloading church worship schedules in PDF format with Tamil language support.

## Features

- Month and Place filter selection
- Editable schedule table with all columns editable
- PDF generation with Tamil text support
- Clean, professional table layout matching traditional church schedule format

## Technology Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express
- **PDF Generation**: Puppeteer

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the Application

1. Start the backend server:
```bash
npm run server
```

2. In a new terminal, start the frontend development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Select a **Month** from the dropdown
2. Select a **Place/Church** from the dropdown (enabled after month selection)
3. The schedule table will appear with all dates for the selected month
4. Edit any column (Date, Time, Service Type, Speaker) as needed
5. Click **"PDF பதிவிறக்க"** (Download PDF) to generate and download the schedule

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── Filters.tsx          # Month and Place filter component
│   │   ├── ScheduleTable.tsx     # Editable schedule table
│   │   └── PDFDownload.tsx       # PDF download button
│   ├── data/
│   │   └── churches.json         # Church data
│   ├── types/
│   │   └── schedule.ts          # TypeScript interfaces
│   ├── utils/
│   │   └── dateHelpers.ts       # Date utility functions
│   ├── App.tsx                  # Main application component
│   └── main.tsx                 # React entry point
├── server/
│   ├── routes/
│   │   └── pdf.ts               # PDF generation endpoint
│   └── index.ts                 # Express server setup
└── package.json
```

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

