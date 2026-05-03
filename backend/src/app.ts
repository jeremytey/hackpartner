import express from 'express';
import { Request, Response, NextFunction } from 'express';
import cors from 'cors'; //
import cookieParser from 'cookie-parser';
import { logger } from './lib/logger'; // Winston logger 
import { errorMiddleware } from './middleware/error.middleware';

import authRouter from './routes/auth.routes';
import userRouter from './routes/user.routes';
import hackathonRouter from './routes/hackathon.routes';
import skillRouter from './routes/skill.routes';

const app = express();

const allowedOrigins = [
  'http://localhost:5173', // Vite dev server
  'https://hackpartner.dev',
  'https://www.hackpartner.dev',
  process.env.FRONTEND_URL
  ].filter(Boolean) as string[]; // Filter out undefined values

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Custom Winston Request Logger Middleware - Logs HTTP method and URL for each incoming request
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Health Check Endpoint
app.get('/', (_req, res) => {
  res.json({ status: 'ok', service: 'HackPartner API' });
});

// Routes
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/hackathons', hackathonRouter);
app.use('/skills', skillRouter);

app.use(errorMiddleware);

export default app;