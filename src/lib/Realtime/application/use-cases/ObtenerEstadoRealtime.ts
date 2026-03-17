import { supabaseAdmin } from '../../../../infrastructure/supabase/client';

const REALTIME_BLOCK_TYPES = ['live_status', 'availability_calendar'] as const;

export class ObtenerEstadoRealtime {
  async execute(cardId: string) {
    const { data: card } = await supabaseAdmin
      .from('cards').select('blocks, updated_at').eq('id', cardId).eq('status', 'active').single();

    if (!card) return null;

    const blocks = (card.blocks as { id: string; type: string; config: Record<string, unknown> }[]) || [];
    const realtimeBlocks = blocks.filter(b =>
      REALTIME_BLOCK_TYPES.includes(b.type as typeof REALTIME_BLOCK_TYPES[number])
    );

    return { blocks: realtimeBlocks, updated_at: card.updated_at };
  }
}
