import express from 'express';
import cors from 'cors';
import pdfRoutes from './routes/pdf.js';
var app = express();
var PORT = 3001;
app.use(cors());
app.use(express.json());
app.use('/api', pdfRoutes);
app.listen(PORT, function () {
    console.log("Server running on http://localhost:".concat(PORT));
});
