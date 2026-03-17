import type { Response } from 'express';
import type { AuthRequest } from '../../../../../middleware/auth.middleware';
import { CreateCardDtoSchema } from '../../../application/dtos/card.dto';
import { ListarCards } from '../../../application/use-cases/ListarCards';
import { ObtenerCard } from '../../../application/use-cases/ObtenerCard';
import { CrearCard } from '../../../application/use-cases/CrearCard';
import { ActualizarCard } from '../../../application/use-cases/ActualizarCard';
import { EliminarCard } from '../../../application/use-cases/EliminarCard';
import { PublicarCard } from '../../../application/use-cases/PublicarCard';
import { DuplicarCard } from '../../../application/use-cases/DuplicarCard';
import { CardRepositorySupabase } from '../../CardRepositorySupabase';

const repo          = new CardRepositorySupabase();
const listarCards   = new ListarCards(repo);
const obtenerCard   = new ObtenerCard(repo);
const crearCard     = new CrearCard(repo);
const actualizarCard = new ActualizarCard(repo);
const eliminarCard  = new EliminarCard(repo);
const publicarCard  = new PublicarCard(repo);
const duplicarCard  = new DuplicarCard(repo);

export const listarCardsHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  const cards = await listarCards.execute(req.user!.id);
  res.json({ cards });
};

export const obtenerCardHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  const card = await obtenerCard.execute(req.params.id, req.user!.id);
  if (!card) { res.status(404).json({ error: 'Card not found' }); return; }
  res.json({ card });
};

export const crearCardHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  const parse = CreateCardDtoSchema.safeParse(req.body);
  if (!parse.success) { res.status(400).json({ error: parse.error.flatten() }); return; }
  try {
    const card = await crearCard.execute(parse.data, req.user!.id);
    res.status(201).json({ card });
  } catch (e: unknown) { res.status(500).json({ error: (e as Error).message }); }
};

export const actualizarCardHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  const parse = CreateCardDtoSchema.partial().safeParse(req.body);
  if (!parse.success) { res.status(400).json({ error: parse.error.flatten() }); return; }
  const card = await actualizarCard.execute(req.params.id, req.user!.id, parse.data);
  if (!card) { res.status(404).json({ error: 'Card not found' }); return; }
  res.json({ card });
};

export const eliminarCardHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  const ok = await eliminarCard.execute(req.params.id, req.user!.id);
  if (!ok) { res.status(404).json({ error: 'Card not found' }); return; }
  res.json({ message: 'Deleted' });
};

export const publicarCardHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  const card = await publicarCard.execute(req.params.id, req.user!.id);
  if (!card) { res.status(404).json({ error: 'Card not found' }); return; }
  res.json({ card, url: card.public_url });
};

export const duplicarCardHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  const card = await duplicarCard.execute(req.params.id, req.user!.id);
  if (!card) { res.status(404).json({ error: 'Card not found' }); return; }
  res.status(201).json({ card });
};

export const actualizarBloquesHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  const { blocks } = req.body;
  if (!Array.isArray(blocks)) { res.status(400).json({ error: 'blocks must be array' }); return; }
  const card = await actualizarCard.execute(req.params.id, req.user!.id, { blocks });
  if (!card) { res.status(404).json({ error: 'Card not found' }); return; }
  res.json({ card });
};

export const obtenerUrlCardHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  const card = await obtenerCard.execute(req.params.id, req.user!.id);
  if (!card) { res.status(404).json({ error: 'Card not found' }); return; }
  res.json({ url: card.public_url, slug: card.slug });
};
