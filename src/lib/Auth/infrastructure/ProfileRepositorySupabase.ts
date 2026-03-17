import { supabaseAdmin } from '../../../infrastructure/supabase/client';
import type { ProfileProps } from '../domain/Profile.entity';

export class ProfileRepositorySupabase {
  async findByUserId(userId: string): Promise<ProfileProps | null> {
    const { data } = await supabaseAdmin.from('profiles').select('*').eq('user_id', userId).maybeSingle();
    return data as ProfileProps | null;
  }

  async upsert(userId: string, email: string | undefined, fullName: string | null, avatarUrl: string | null): Promise<ProfileProps> {
    const existing = await this.findByUserId(userId);
    if (existing) return existing;

    const base = (fullName || email?.split('@')[0] || 'user')
      .toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 20);
    const username = `${base}-${userId.replace(/-/g, '').substring(0, 6)}`;

    const { data, error } = await supabaseAdmin.from('profiles').insert({
      id: userId, user_id: userId, username,
      full_name: fullName, email: email || null,
      avatar_url: avatarUrl, avatar_emoji: '🚀',
      plan: 'free', domain_mode: 'path', custom_domain: null,
    }).select().single();

    if (error) throw new Error(`Profile creation failed: ${error.message}`);
    return data as ProfileProps;
  }
}
