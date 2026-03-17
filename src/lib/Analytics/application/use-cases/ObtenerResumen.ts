import { supabaseAdmin } from '../../../../infrastructure/supabase/client';

export class ObtenerResumen {
  async execute(userId: string) {
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const [
      { data: cards },
      { count: totalScans },
      { count: saved },
      { data: deviceRows },
    ] = await Promise.all([
      supabaseAdmin.from('cards').select('id,name,scan_count,status,type').eq('user_id', userId),
      supabaseAdmin.from('scans').select('*', { count: 'exact', head: true }).eq('user_id', userId).gte('created_at', since),
      supabaseAdmin.from('scans').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('action', 'saved_contact').gte('created_at', since),
      supabaseAdmin.from('scans').select('device_type').eq('user_id', userId).gte('created_at', since),
    ]);

    const devices = { ios: 0, android: 0, desktop: 0, other: 0 };
    deviceRows?.forEach((r: { device_type: string }) => {
      (devices as Record<string, number>)[r.device_type] = ((devices as Record<string, number>)[r.device_type] || 0) + 1;
    });

    const total = totalScans || 0;
    const savedN = saved || 0;

    return {
      total_scans: total, saved_contacts: savedN,
      conversion_rate: total > 0 ? Math.round((savedN / total) * 1000) / 10 : 0,
      active_cards: cards?.filter(c => c.status === 'active').length || 0,
      total_cards: cards?.length || 0,
      cards_summary: cards || [], devices,
    };
  }
}
