import { Router } from 'express';
import { requireAuth } from '../../../../../middleware/auth.middleware';
import { actualizarBloqueHandler, obtenerEstadoHandler } from '../controller/RealtimeController';

export const realtimeRouter = Router();
realtimeRouter.use(requireAuth);

realtimeRouter.patch('/:cardId/block/:blockId', actualizarBloqueHandler);
realtimeRouter.get('/:cardId/status',           obtenerEstadoHandler);
