import type { Request, Response } from 'express';
import { z } from 'zod';
import type { AuthRequest } from '../../../../../middleware/auth.middleware';
import { ProfileRepositorySupabase } from '../../ProfileRepositorySupabase';
import { GoogleCallback } from '../../../application/use-cases/GoogleCallback';
import { AsegurarPerfil } from '../../../application/use-cases/AsegurarPerfil';
import { RefrescarToken } from '../../../application/use-cases/RefrescarToken';
import { supabaseAdmin } from '../../../../../infrastructure/supabase/client';

const profileRepo = new ProfileRepositorySupabase();
const googleCallback = new GoogleCallback(profileRepo);
const asegurarPerfil = new AsegurarPerfil(profileRepo);
const refrescarToken = new RefrescarToken();

export const googleCallbackHandler = async (req: Request, res: Response): Promise<void> => {
  const { access_token, refresh_token } = req.body;
  if (!access_token) { res.status(400).json({ error: 'access_token required' }); return; }
  try {
    const result = await googleCallback.execute(access_token, refresh_token);
    res.json(result);
  } catch (err: unknown) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const getMeHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  const { data: profile } = await supabaseAdmin.from('profiles').select('*').eq('user_id', req.user!.id).maybeSingle();
  if (!profile) { res.status(404).json({ error: 'Profile not found' }); return; }
  res.json({ user: { id: req.user!.id, email: req.user!.email }, profile });
};

export const asegurarPerfilHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const profile = await asegurarPerfil.execute(req.user!.id);
    res.json({ profile });
  } catch (err: unknown) { res.status(500).json({ error: (err as Error).message }); }
};

export const refrescarTokenHandler = async (req: Request, res: Response): Promise<void> => {
  const schema = z.object({ refresh_token: z.string() });
  const parse = schema.safeParse(req.body);
  if (!parse.success) { res.status(400).json({ error: 'refresh_token required' }); return; }
  try {
    const session = await refrescarToken.execute(parse.data.refresh_token);
    res.json({ session });
  } catch (err: unknown) { res.status(401).json({ error: (err as Error).message }); }
};
