import type { ICardRepository } from '../../domain/CardRepository';
import type { CardProps } from '../../domain/Card.entity';

export class PublicarCard {
  constructor(private readonly repo: ICardRepository) {}

  async execute(id: string, userId: string): Promise<CardProps | null> {
    return this.repo.update(id, userId, { status: 'active' });
  }
}
