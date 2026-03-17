import type { Response } from 'express';
import type { AuthRequest } from '../../../../../middleware/auth.middleware';
import { ActualizarBloqueRealtime } from '../../../application/use-cases/ActualizarBloqueRealtime';
import { ObtenerEstadoRealtime } from '../../../application/use-cases/ObtenerEstadoRealtime';

const actualizarBloque  = new ActualizarBloqueRealtime();
const obtenerEstado     = new ObtenerEstadoRealtime();

export const actualizarBloqueHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  const { cardId, blockId } = req.params;
  try {
    const result = await actualizarBloque.execute(cardId, req.user!.id, blockId, req.body);
    if (!result) { res.status(404).json({ error: 'Card not found' }); return; }
    res.json(result);
  } catch (err: unknown) {
    const msg = (err as Error).message;
    const isValidation = msg.startsWith('{');
    res.status(isValidation ? 400 : 500).json({ error: isValidation ? JSON.parse(msg) : msg });
  }
};

export const obtenerEstadoHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  const result = await obtenerEstado.execute(req.params.cardId);
  if (!result) { res.status(404).json({ error: 'Not found' }); return; }
  res.set('Cache-Control', 'no-cache, no-store');
  res.json(result);
};
