import type { ICardRepository } from '../../domain/CardRepository';
import type { CardProps } from '../../domain/Card.entity';
import type { UpdateCardDto } from '../dtos/card.dto';

export class ActualizarCard {
  constructor(private readonly repo: ICardRepository) {}

  async execute(id: string, userId: string, dto: UpdateCardDto): Promise<CardProps | null> {
    return this.repo.update(id, userId, dto as Partial<CardProps>);
  }
}
