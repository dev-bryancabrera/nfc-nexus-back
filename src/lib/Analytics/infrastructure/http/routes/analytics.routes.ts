import { Router } from 'express';
import { requireAuth } from '../../../../../middleware/auth.middleware';
import { resumenHandler, analyticsPorCardHandler, escaneosHandler } from '../controller/AnalyticsController';

export const analyticsRouter = Router();
analyticsRouter.use(requireAuth);

analyticsRouter.get('/overview',       resumenHandler);
analyticsRouter.get('/card/:cardId',   analyticsPorCardHandler);
analyticsRouter.get('/scans',          escaneosHandler);
