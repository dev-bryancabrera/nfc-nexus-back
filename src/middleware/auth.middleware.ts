import type { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../infrastructure/supabase/client';

export interface AuthRequest extends Request {
  user?: { id: string; email?: string };
}

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) { res.status(401).json({ error: 'Unauthorized' }); return; }
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) { res.status(401).json({ error: 'Invalid token' }); return; }
  req.user = { id: user.id, email: user.email };
  next();
};

export const optionalAuth = async (req: AuthRequest, _res: Response, next: NextFunction): Promise<void> => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (token) {
    const { data: { user } } = await supabaseAdmin.auth.getUser(token).catch(() => ({ data: { user: null } }));
    if (user) req.user = { id: user.id, email: user.email };
  }
  next();
};
