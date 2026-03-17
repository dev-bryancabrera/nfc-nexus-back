import { v4 as uuidv4 } from 'uuid';
import { domainConfig } from '../../../../infrastructure/config/domain.config';
import type { ICardRepository } from '../../domain/CardRepository';
import type { CardProps } from '../../domain/Card.entity';

function makeSlug(name: string, userId: string): string {
  const base = name.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 24);
  const uid = userId.replace(/-/g, '').substring(0, 6);
  return `${base}-${uid}`;
}

export class DuplicarCard {
  constructor(private readonly repo: ICardRepository) {}

  async execute(id: string, userId: string): Promise<CardProps | null> {
    const original = await this.repo.findById(id, userId);
    if (!original) return null;

    const newName = `${original.name} (copia)`;
    const slug = makeSlug(newName, userId + Date.now());
    const publicUrl = domainConfig.buildPublicUrl(slug);

    const { id: _id, created_at: _c, updated_at: _u, scan_count: _s, ...rest } = original;

    return this.repo.create({
      ...rest,
      id: uuidv4(),
      name: newName,
      slug,
      public_url: publicUrl,
      status: 'draft',
    });
  }
}
