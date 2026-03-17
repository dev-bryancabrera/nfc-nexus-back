import { Router } from 'express';
import { requireAuth } from '../../../../../middleware/auth.middleware';
import { obtenerPerfilHandler, actualizarPerfilHandler, verificarUsernameHandler } from '../controller/UsersController';

export const usersRouter = Router();

usersRouter.get('/profile', requireAuth, obtenerPerfilHandler);
usersRouter.put('/profile', requireAuth, actualizarPerfilHandler);
usersRouter.get('/check-username/:username', verificarUsernameHandler);
