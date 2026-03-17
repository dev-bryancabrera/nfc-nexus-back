import { v4 as uuidv4 } from 'uuid';
import { domainConfig } from '../../../../infrastructure/config/domain.config';
import type { ICardRepository } from '../../domain/CardRepository';
import type { CardProps } from '../../domain/Card.entity';
import type { CreateCardDto } from '../dtos/card.dto';

function makeSlug(name: string, userId: string): string {
  const base = name.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 24);
  const uid = userId.replace(/-/g, '').substring(0, 6);
  return `${base}-${uid}`;
}

export class CrearCard {
  constructor(private readonly repo: ICardRepository) {}

  async execute(dto: CreateCardDto, userId: string): Promise<CardProps> {
    const slug = makeSlug(dto.name, userId);
    const publicUrl = domainConfig.buildPublicUrl(slug);

    return this.repo.create({
      id: uuidv4(),
      user_id: userId,
      slug,
      public_url: publicUrl,
      scan_count: 0,
      ...dto,
    } as unknown as Omit<CardProps, 'created_at' | 'updated_at' | 'scan_count'>);
  }
}
