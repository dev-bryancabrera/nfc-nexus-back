import type { ICardRepository } from '../../domain/CardRepository';
import type { CardProps } from '../../domain/Card.entity';

export class ListarCards {
  constructor(private readonly repo: ICardRepository) {}

  async execute(userId: string): Promise<CardProps[]> {
    return this.repo.findAllByUser(userId);
  }
}
