import { Router } from 'express';
import { requireAuth } from '../../../../../middleware/auth.middleware';
import {
  googleCallbackHandler,
  getMeHandler,
  asegurarPerfilHandler,
  refrescarTokenHandler,
} from '../controller/AuthController';

export const authRouter = Router();

authRouter.post('/google/callback', googleCallbackHandler);
authRouter.get('/me', requireAuth, getMeHandler);
authRouter.post('/ensure-profile', requireAuth, asegurarPerfilHandler);
authRouter.post('/refresh', refrescarTokenHandler);
authRouter.post('/logout', requireAuth, (_req, res) => res.json({ message: 'Logged out' }));
