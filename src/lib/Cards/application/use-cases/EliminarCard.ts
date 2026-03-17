import type { ICardRepository } from '../../domain/CardRepository';

export class EliminarCard {
  constructor(private readonly repo: ICardRepository) {}

  async execute(id: string, userId: string): Promise<boolean> {
    return this.repo.delete(id, userId);
  }
}
