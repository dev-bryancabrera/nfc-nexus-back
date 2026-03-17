import { z } from 'zod';
import { supabaseAdmin } from '../../../../infrastructure/supabase/client';

const LiveStatusSchema = z.object({
  status: z.enum(['available', 'busy', 'away', 'dnd', 'custom']),
  message: z.string().max(120).optional(),
  until: z.string().optional().nullable(),
});

const AvailabilitySchema = z.object({
  available_days: z.array(z.number().min(0).max(6)),
  from: z.string().regex(/^\d{2}:\d{2}$/),
  to: z.string().regex(/^\d{2}:\d{2}$/),
  booking_url: z.string().url().optional().or(z.literal('')),
});

export class ActualizarBloqueRealtime {
  async execute(cardId: string, userId: string, blockId: string, body: Record<string, unknown>) {
    const { data: card, error } = await supabaseAdmin
      .from('cards').select('id, user_id, blocks, settings')
      .eq('id', cardId).eq('user_id', userId).single();

    if (error || !card) return null;

    const blocks = (card.blocks as { id: string; type: string; config: Record<string, unknown> }[]) || [];
    const blockIdx = blocks.findIndex(b => b.id === blockId);
    if (blockIdx === -1) throw new Error('Block not found');

    const block = blocks[blockIdx];
    let parsed: Record<string, unknown>;

    if (block.type === 'live_status') {
      const result = LiveStatusSchema.safeParse(body);
      if (!result.success) throw new Error(JSON.stringify(result.error.flatten()));
      parsed = result.data;
    } else if (block.type === 'availability_calendar') {
      const result = AvailabilitySchema.safeParse(body);
      if (!result.success) throw new Error(JSON.stringify(result.error.flatten()));
      parsed = result.data;
    } else {
      throw new Error(`Block type '${block.type}' is not a realtime block`);
    }

    blocks[blockIdx] = { ...block, config: { ...block.config, ...parsed } };

    const { data: updated, error: updateError } = await supabaseAdmin
      .from('cards')
      .update({ blocks, updated_at: new Date().toISOString() })
      .eq('id', cardId).eq('user_id', userId)
      .select('id, blocks, updated_at').single();

    if (updateError || !updated) throw new Error('Update failed');

    return { block: updated.blocks[blockIdx], updated_at: updated.updated_at };
  }
}
