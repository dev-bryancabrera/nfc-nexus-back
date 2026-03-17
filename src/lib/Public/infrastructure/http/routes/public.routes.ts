import { Router } from 'express';
import {
  servirCardPathHandler,
  registrarEscaneoPathHandler,
  servirCardSubdomainHandler,
  registrarEscaneoSubdomainHandler,
} from '../controller/PublicController';

export const publicRouter = Router();

publicRouter.get('/card/:slug',        servirCardPathHandler);
publicRouter.post('/card/:slug/scan',  registrarEscaneoPathHandler);
publicRouter.get('/subdomain',         servirCardSubdomainHandler);
publicRouter.post('/subdomain/scan',   registrarEscaneoSubdomainHandler);
