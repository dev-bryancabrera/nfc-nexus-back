import { supabaseAdmin } from '../../../../infrastructure/supabase/client';

interface ScanRow { device_type: string; action: string; created_at: string }

export class ObtenerAnalyticsPorCard {
  async execute(cardId: string, userId: string, days = 30) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    const { data: card } = await supabaseAdmin.from('cards').select('id').eq('id', cardId).eq('user_id', userId).single();
    if (!card) return null;

    const { data: scans } = await supabaseAdmin
      .from('scans').select('*').eq('card_id', cardId)
      .gte('created_at', since).order('created_at', { ascending: false });

    const byDay: Record<string, number> = {};
    const actions: Record<string, number> = {};
    scans?.forEach((s: ScanRow) => {
      const day = s.created_at.split('T')[0];
      byDay[day] = (byDay[day] || 0) + 1;
      actions[s.action] = (actions[s.action] || 0) + 1;
    });

    return { scans_by_day: byDay, actions, total: scans?.length || 0, scans };
  }
}
