import { CardRepositorySupabase } from '../../../Cards/infrastructure/CardRepositorySupabase';
import { RegistrarEscaneo as RegistrarEscaneoCard } from '../../../Cards/application/use-cases/RegistrarEscaneo';
import { ScanRepositorySupabase } from '../../infrastructure/ScanRepositorySupabase';

const cardRepo      = new CardRepositorySupabase();
const scanRepo      = new ScanRepositorySupabase();
const registrarScan = new RegistrarEscaneoCard(cardRepo);

function detectDevice(ua: string): string {
  const u = ua.toLowerCase();
  if (u.includes('iphone') || u.includes('ipad')) return 'ios';
  if (u.includes('android')) return 'android';
  if (u.includes('windows') || u.includes('mac') || u.includes('linux')) return 'desktop';
  return 'other';
}

export class RegistrarEscaneo {
  async execute(slug: string, userAgent: string, action: string, referrer: string | null): Promise<boolean> {
    const card = await cardRepo.findBySlug(slug);
    if (!card) return false;

    await scanRepo.record({
      card_id: card.id, user_id: card.user_id,
      device_type: detectDevice(userAgent),
      user_agent: userAgent.substring(0, 500),
      action,
      referrer: referrer ? referrer.substring(0, 500) : null,
    });

    await registrarScan.execute(card.id);
    return true;
  }
}
