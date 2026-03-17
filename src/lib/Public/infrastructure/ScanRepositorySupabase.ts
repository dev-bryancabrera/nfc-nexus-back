import { supabaseAdmin } from '../../../infrastructure/supabase/client';
import type { IScanRepository } from '../domain/ScanRepository';

export class ScanRepositorySupabase implements IScanRepository {
  async record(data: {
    card_id: string; user_id: string; device_type: string;
    user_agent: string | null; action: string; referrer: string | null;
  }): Promise<void> {
    await supabaseAdmin.from('scans').insert({ ...data, ip_city: null, ip_country: null });
  }
}
