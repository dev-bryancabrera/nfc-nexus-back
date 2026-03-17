import type { Response } from 'express';
import type { AuthRequest } from '../../../../../middleware/auth.middleware';
import { ObtenerResumen } from '../../../application/use-cases/ObtenerResumen';
import { ObtenerAnalyticsPorCard } from '../../../application/use-cases/ObtenerAnalyticsPorCard';
import { ObtenerEscaneos } from '../../../application/use-cases/ObtenerEscaneos';

const obtenerResumen         = new ObtenerResumen();
const obtenerAnalyticsPorCard = new ObtenerAnalyticsPorCard();
const obtenerEscaneos        = new ObtenerEscaneos();

export const resumenHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  const data = await obtenerResumen.execute(req.user!.id);
  res.json(data);
};

export const analyticsPorCardHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  const days = Number(req.query.days) || 30;
  const data = await obtenerAnalyticsPorCard.execute(req.params.cardId, req.user!.id, days);
  if (!data) { res.status(404).json({ error: 'Card not found' }); return; }
  res.json(data);
};

export const escaneosHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const scans = await obtenerEscaneos.execute(req.user!.id, limit);
  res.json({ scans });
};
