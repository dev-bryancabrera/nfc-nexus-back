import { supabaseAdmin } from '../../../../infrastructure/supabase/client';

interface UpdateProfileData {
  full_name?: string;
  avatar_emoji?: string;
  domain_mode?: 'path' | 'subdomain';
  custom_domain?: string | null;
}

export class ActualizarPerfil {
  async execute(userId: string, data: UpdateProfileData) {
    const { data: updated, error } = await supabaseAdmin
      .from('profiles').update({ ...data, updated_at: new Date().toISOString() })
      .eq('user_id', userId).select().single();

    if (error || !updated) throw new Error(error?.message || 'Update failed');

    if (data.domain_mode) {
      const { data: cards } = await supabaseAdmin.from('cards').select('id,slug').eq('user_id', userId);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      for (const card of cards || []) {
        const newUrl = data.domain_mode === 'subdomain'
          ? `${frontendUrl.startsWith('https') ? 'https' : 'http'}://${card.slug}.${process.env.ROOT_DOMAIN || 'nexusnfc.com'}`
          : `${frontendUrl}/u/${card.slug}`;
        await supabaseAdmin.from('cards').update({ public_url: newUrl }).eq('id', card.id);
      }
    }

    return updated;
  }
}
