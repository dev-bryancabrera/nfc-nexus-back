import { supabaseAdmin } from '../../../../infrastructure/supabase/client';

export class RefrescarToken {
  async execute(refreshToken: string) {
    const { data, error } = await supabaseAdmin.auth.refreshSession({ refresh_token: refreshToken });
    if (error || !data.session) throw new Error('Invalid refresh token');
    return data.session;
  }
}
