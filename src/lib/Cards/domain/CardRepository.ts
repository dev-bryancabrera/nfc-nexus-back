import type { CardProps } from './Card.entity';

export interface ICardRepository {
  findAllByUser(userId: string): Promise<CardProps[]>;
  findById(id: string, userId: string): Promise<CardProps | null>;
  findBySlug(slug: string): Promise<CardProps | null>;
  create(card: Omit<CardProps, 'created_at' | 'updated_at' | 'scan_count'>): Promise<CardProps>;
  update(id: string, userId: string, data: Partial<CardProps>): Promise<CardProps | null>;
  delete(id: string, userId: string): Promise<boolean>;
  incrementScanCount(cardId: string): Promise<void>;
}
