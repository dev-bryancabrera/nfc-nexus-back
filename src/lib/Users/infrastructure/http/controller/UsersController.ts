import type { Request, Response } from 'express';
import { z } from 'zod';
import type { AuthRequest } from '../../../../../middleware/auth.middleware';
import { ObtenerPerfil } from '../../../application/use-cases/ObtenerPerfil';
import { ActualizarPerfil } from '../../../application/use-cases/ActualizarPerfil';
import { VerificarUsername } from '../../../application/use-cases/VerificarUsername';

const UpdateProfileSchema = z.object({
  full_name: z.string().min(2).max(100).optional(),
  avatar_emoji: z.string().max(4).optional(),
  domain_mode: z.enum(['path', 'subdomain']).optional(),
  custom_domain: z.string().nullable().optional(),
});

const obtenerPerfil   = new ObtenerPerfil();
const actualizarPerfil = new ActualizarPerfil();
const verificarUsername = new VerificarUsername();

export const obtenerPerfilHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  const profile = await obtenerPerfil.execute(req.user!.id);
  if (!profile) { res.status(404).json({ error: 'Profile not found' }); return; }
  res.json({ profile });
};

export const actualizarPerfilHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  const parse = UpdateProfileSchema.safeParse(req.body);
  if (!parse.success) { res.status(400).json({ error: parse.error.flatten() }); return; }
  try {
    const profile = await actualizarPerfil.execute(req.user!.id, parse.data);
    res.json({ profile });
  } catch (err: unknown) { res.status(500).json({ error: (err as Error).message }); }
};

export const verificarUsernameHandler = async (req: Request, res: Response): Promise<void> => {
  const available = await verificarUsername.execute(req.params.username);
  res.json({ available });
};
