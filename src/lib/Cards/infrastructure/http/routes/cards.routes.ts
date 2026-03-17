import { Router } from 'express';
import { requireAuth } from '../../../../../middleware/auth.middleware';
import {
  listarCardsHandler, obtenerCardHandler, crearCardHandler, actualizarCardHandler,
  eliminarCardHandler, publicarCardHandler, duplicarCardHandler,
  actualizarBloquesHandler, obtenerUrlCardHandler,
} from '../controller/CardsController';

export const cardsRouter = Router();
cardsRouter.use(requireAuth);

cardsRouter.get('/',               listarCardsHandler);
cardsRouter.post('/',              crearCardHandler);
cardsRouter.get('/:id',            obtenerCardHandler);
cardsRouter.put('/:id',            actualizarCardHandler);
cardsRouter.delete('/:id',         eliminarCardHandler);
cardsRouter.post('/:id/publish',   publicarCardHandler);
cardsRouter.post('/:id/duplicate', duplicarCardHandler);
cardsRouter.put('/:id/blocks',     actualizarBloquesHandler);
cardsRouter.get('/:id/url',        obtenerUrlCardHandler);
