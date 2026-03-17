import { supabaseAdmin } from '../../../../infrastructure/supabase/client';
import { ProfileRepositorySupabase } from '../../infrastructure/ProfileRepositorySupabase';
import type { ProfileProps } from '../../domain/Profile.entity';

export class AsegurarPerfil {
  constructor(private readonly profileRepo: ProfileRepositorySupabase) {}

  async execute(userId: string): Promise<ProfileProps> {
    const { data: { user } } = await supabaseAdmin.auth.admin.getUserById(userId);
    if (!user) throw new Error('User not found');

    const meta = user.user_metadata || {};
    return this.profileRepo.upsert(
      user.id, user.email,
      meta.full_name || meta.name || null,
      meta.avatar_url || meta.picture || null,
    );
  }
}
