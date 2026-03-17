import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';

import { authRouter }      from './lib/Auth';
import { cardsRouter }     from './lib/Cards';
import { analyticsRouter } from './lib/Analytics';
import { usersRouter }     from './lib/Users';
import { publicRouter }    from './lib/Public';
import { realtimeRouter }  from './lib/Realtime';
import { errorHandler, notFound } from './middleware/error.middleware';
import { domainConfig }    from './infrastructure/config/domain.config';

const app = express();

const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173').split(',').map(s => s.trim());

app.use(helmet());
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (domainConfig.mode === 'subdomain' && origin.endsWith(domainConfig.rootDomain)) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
}));
app.use(rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
  max: Number(process.env.RATE_LIMIT_MAX) || 200,
  standardHeaders: true,
  legacyHeaders: false,
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => res.json({
  status: 'ok',
  domain_mode: domainConfig.mode,
  ts: new Date().toISOString(),
}));

app.use('/api/auth',      authRouter);
app.use('/api/cards',     cardsRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/users',     usersRouter);
app.use('/api/public',    publicRouter);
app.use('/api/realtime',  realtimeRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
