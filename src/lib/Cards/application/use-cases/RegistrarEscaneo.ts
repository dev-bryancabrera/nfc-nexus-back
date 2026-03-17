import type { ICardRepository } from '../../domain/CardRepository';

export class RegistrarEscaneo {
  constructor(private readonly repo: ICardRepository) {}

  async execute(cardId: string): Promise<void> {
    await this.repo.incrementScanCount(cardId);
  }
}
