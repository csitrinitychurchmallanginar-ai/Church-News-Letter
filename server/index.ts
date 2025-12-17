import express from 'express';
import cors from 'cors';
import pdfRoutes from './routes/pdf.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use('/api', pdfRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

