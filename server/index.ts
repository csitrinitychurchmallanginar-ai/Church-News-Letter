import express from 'express';
import cors from 'cors';
import pdfRoutes from './routes/pdf.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors()); // Allow all origins for now to simplify deployment
app.use(express.json());
app.use('/api', pdfRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

