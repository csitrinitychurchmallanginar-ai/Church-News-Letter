import express from 'express';
import cors from 'cors';
import pdfRoutes from './routes/pdf.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Define __dirname for ES modules
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cors()); // Allow all origins for now to simplify deployment
app.use(express.json());

app.use('/api', pdfRoutes);

// Serve static files from the dist directory (Vite build output)
// We need to go up one level because server/index.ts is in server/
const distPath = join(__dirname, '../dist');
app.use(express.static(distPath));

// Handle SPA routing: send index.html for any other requests
app.get('*', (req, res) => {
  res.sendFile(join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

