import { supabaseAdmin } from '../../../../infrastructure/supabase/client';

export class ObtenerPerfil {
  async execute(userId: string) {
    const { data } = await supabaseAdmin.from('profiles').select('*').eq('user_id', userId).single();
    return data;
  }
}
