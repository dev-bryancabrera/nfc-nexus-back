import { supabaseAdmin } from '../../../infrastructure/supabase/client';
import type { ICardRepository } from '../domain/CardRepository';
import type { CardProps } from '../domain/Card.entity';

export class CardRepositorySupabase implements ICardRepository {
  async findAllByUser(userId: string): Promise<CardProps[]> {
    const { data, error } = await supabaseAdmin
      .from('cards').select('*').eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data || []) as CardProps[];
  }

  async findById(id: string, userId: string): Promise<CardProps | null> {
    const { data } = await supabaseAdmin
      .from('cards').select('*').eq('id', id).eq('user_id', userId).single();
    return data as CardProps | null;
  }

  async findBySlug(slug: string): Promise<CardProps | null> {
    const { data } = await supabaseAdmin
      .from('cards').select('*').eq('slug', slug).eq('status', 'active').single();
    return data as CardProps | null;
  }

  async create(card: Omit<CardProps, 'created_at' | 'updated_at' | 'scan_count'>): Promise<CardProps> {
    const { data, error } = await supabaseAdmin.from('cards').insert(card).select().single();
    if (error) throw new Error(error.message);
    return data as CardProps;
  }

  async update(id: string, userId: string, data: Partial<CardProps>): Promise<CardProps | null> {
    const { data: updated, error } = await supabaseAdmin
      .from('cards')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id).eq('user_id', userId)
      .select().single();
    if (error) { console.error('update card error:', error.message); throw new Error(error.message); }
    return updated as CardProps;
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const { error } = await supabaseAdmin.from('cards').delete().eq('id', id).eq('user_id', userId);
    return !error;
  }

  async incrementScanCount(cardId: string): Promise<void> {
    const { error } = await supabaseAdmin.rpc('increment_scan_count', { p_card_id: cardId });
    if (error) console.error('RPC increment_scan_count error:', error.message);
  }
}
