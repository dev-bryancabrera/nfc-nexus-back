import { supabaseAdmin } from '../../../../infrastructure/supabase/client';

export class ObtenerEscaneos {
  async execute(userId: string, limit = 20) {
    const { data } = await supabaseAdmin
      .from('scans').select('*, cards(name)').eq('user_id', userId)
      .order('created_at', { ascending: false }).limit(limit);
    return data || [];
  }
}
