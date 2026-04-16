import { supabaseAdmin } from '../../../../infrastructure/supabase/client';

interface ScanRow { device_type: string; action: string; created_at: string }

export class ObtenerAnalyticsPorCard {
  async execute(cardId: string, userId: string, days = 30) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    const { data: card } = await supabaseAdmin
      .from('cards')
      .select('id, name, type, status, scan_count')
      .eq('id', cardId).eq('user_id', userId).single();
    if (!card) return null;

    const { data: scans } = await supabaseAdmin
      .from('scans').select('*').eq('card_id', cardId)
      .gte('created_at', since).order('created_at', { ascending: false });

    const byDay: Record<string, number> = {};
    const actions: Record<string, number> = {};
    const devices = { ios: 0, android: 0, desktop: 0, other: 0 };

    scans?.forEach((s: ScanRow) => {
      const day = s.created_at.split('T')[0];
      byDay[day] = (byDay[day] || 0) + 1;
      actions[s.action] = (actions[s.action] || 0) + 1;
      const d = s.device_type as keyof typeof devices;
      if (d in devices) devices[d]++;
      else devices.other++;
    });

    const total = scans?.length || 0;
    const savedContacts = actions['saved_contact'] || 0;
    const conversionRate = total > 0 ? Math.round((savedContacts / total) * 1000) / 10 : 0;

    return {
      card,
      scans_by_day: byDay,
      actions,
      devices,
      total,
      saved_contacts: savedContacts,
      conversion_rate: conversionRate,
      scans,
    };
  }
}
