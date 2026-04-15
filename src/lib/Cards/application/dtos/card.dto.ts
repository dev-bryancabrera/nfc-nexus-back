import { z } from 'zod';

export const BlockDtoSchema = z.object({
  id: z.string(),
  type: z.string(),
  position: z.number(),
  visible: z.boolean().default(true),
  config: z.record(z.unknown()).default({}),
});

export const SettingsDtoSchema = z.object({
  save_contact_btn: z.boolean().default(true),
  analytics_enabled: z.boolean().default(true),
  whatsapp_button: z.boolean().default(true),
  whatsapp_message: z.string().optional(),
  auto_dark_mode: z.boolean().default(true),
  animations: z.boolean().default(true),
  seo_enabled: z.boolean().default(true),
  password_protected: z.boolean().default(false),
  show_emergency_banner: z.boolean().default(false),
  realtime_enabled: z.boolean().default(false),
  theme_color: z.string().optional(),
  access_password: z.string().optional(),
  card_style: z.enum(['dark', 'glass', 'neon', 'gradient', 'light', 'aurora']).default('dark'),
  profile_layout: z.enum(['standard', 'centered', 'banner', 'minimal']).default('standard'),
  font_style: z.enum(['outfit', 'syne', 'inter', 'playfair', 'mono']).default('outfit'),
  show_online_status: z.boolean().default(false),
  require_check_in: z.boolean().default(false),
}).default({});

export const CreateCardDtoSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(['personal', 'business', 'portfolio', 'restaurant', 'medical', 'academic', 'event', 'product', 'blank', 'gamer', 'fitness', 'creator', 'access']).default('personal'),
  status: z.enum(['active', 'draft', 'archived']).default('draft'),
  theme: z.string().default('dark-nexus'),
  blocks: z.array(BlockDtoSchema).default([]),
  settings: SettingsDtoSchema,
  cover_gradient: z.string().default('linear-gradient(135deg,#6366f1,#06ffa5)'),
  cover_image_url: z.string().nullable().optional(),
  full_name: z.string().nullable().optional(),
  role: z.string().nullable().optional(),
  company: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  avatar_emoji: z.string().nullable().optional(),
  avatar_url: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  website: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
});

export type CreateCardDto = z.infer<typeof CreateCardDtoSchema>;
export type UpdateCardDto = Partial<CreateCardDto>;
