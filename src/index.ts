import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

import countryRoutes from './routes/countryRoutes';
import { errorHandler } from './utils/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Health Check Endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the Countries API' });
});

app.use(countryRoutes);

// Global Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
