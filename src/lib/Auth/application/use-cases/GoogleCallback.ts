import { supabaseAdmin } from '../../../../infrastructure/supabase/client';
import { ProfileRepositorySupabase } from '../../infrastructure/ProfileRepositorySupabase';

export class GoogleCallback {
  constructor(private readonly profileRepo: ProfileRepositorySupabase) {}

  async execute(accessToken: string, refreshToken: string) {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);
    if (error || !user) throw new Error('Invalid token');

    const meta = user.user_metadata || {};
    const profile = await this.profileRepo.upsert(
      user.id, user.email,
      meta.full_name || meta.name || null,
      meta.avatar_url || meta.picture || null,
    );

    return {
      user: { id: user.id, email: user.email },
      profile,
      session: { access_token: accessToken, refresh_token: refreshToken },
    };
  }
}
