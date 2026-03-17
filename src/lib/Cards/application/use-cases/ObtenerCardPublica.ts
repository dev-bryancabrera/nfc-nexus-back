import type { ICardRepository } from '../../domain/CardRepository';
import type { CardProps } from '../../domain/Card.entity';

export class ObtenerCardPublica {
  constructor(private readonly repo: ICardRepository) {}

  async execute(slug: string): Promise<Omit<CardProps, 'password_hash'> & { has_password: boolean } | null> {
    const card = await this.repo.findBySlug(slug);
    if (!card) return null;

    const { ...safe } = card as CardProps & { password_hash?: string };
    const hasPassword = !!safe.password_hash;
    delete (safe as { password_hash?: string }).password_hash;

    return { ...safe, has_password: hasPassword };
  }
}
