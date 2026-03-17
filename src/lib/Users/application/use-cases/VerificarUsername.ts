import { supabaseAdmin } from '../../../../infrastructure/supabase/client';

export class VerificarUsername {
  async execute(username: string): Promise<boolean> {
    const { data } = await supabaseAdmin.from('profiles').select('id').eq('username', username).maybeSingle();
    return !data;
  }
}
