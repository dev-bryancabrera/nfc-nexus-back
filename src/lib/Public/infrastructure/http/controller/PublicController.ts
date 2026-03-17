import type { Request, Response } from 'express';
import { domainConfig } from '../../../../../infrastructure/config/domain.config';
import { ServirCard } from '../../../application/use-cases/ServirCard';
import { RegistrarEscaneo } from '../../../application/use-cases/RegistrarEscaneo';

const servirCard      = new ServirCard();
const registrarEscaneo = new RegistrarEscaneo();

export const servirCardHandler = async (slug: string, req: Request, res: Response): Promise<void> => {
  const card = await servirCard.execute(slug);
  if (!card) { res.status(404).json({ error: 'Card not found or inactive' }); return; }
  res.json({ card });
};

export const registrarEscaneoHandler = async (slug: string, req: Request, res: Response): Promise<void> => {
  const { action = 'viewed' } = req.body;
  const ua = req.headers['user-agent'] || '';
  const referrer = (req.headers.referer || '') || null;

  const ok = await registrarEscaneo.execute(slug, ua, action, referrer);
  if (!ok) { res.status(404).json({ error: 'Card not found' }); return; }
  res.json({ ok: true });
};

export const servirCardPathHandler = (req: Request, res: Response) =>
  servirCardHandler(req.params.slug, req, res);

export const registrarEscaneoPathHandler = (req: Request, res: Response) =>
  registrarEscaneoHandler(req.params.slug, req, res);

export const servirCardSubdomainHandler = (req: Request, res: Response) => {
  const slug = domainConfig.extractSlugFromHost(req.headers.host || '');
  if (!slug) { res.status(400).json({ error: 'Cannot extract slug' }); return; }
  servirCardHandler(slug, req, res);
};

export const registrarEscaneoSubdomainHandler = (req: Request, res: Response) => {
  const slug = domainConfig.extractSlugFromHost(req.headers.host || '');
  if (!slug) { res.status(400).json({ error: 'Cannot extract slug' }); return; }
  registrarEscaneoHandler(slug, req, res);
};
