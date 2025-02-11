import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { initializeDatabase } from './config/database';
import { identifyRouter } from './routes/identifyRoutes';
import express, { Request, Response } from 'express';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, world!');
});
app.use('/api/v1/identify', identifyRouter);

// Initialize Database and Start Server
initializeDatabase()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
  });