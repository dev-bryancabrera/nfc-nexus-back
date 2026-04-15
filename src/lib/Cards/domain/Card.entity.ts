export type CardType =
  | 'personal'
  | 'business'
  | 'portfolio'
  | 'restaurant'
  | 'medical'
  | 'academic'
  | 'event'
  | 'product'
  | 'blank'
  | 'gamer'
  | 'fitness'
  | 'creator'
  | 'access';

export type CardStatus = 'active' | 'draft' | 'archived';

export type BlockType =
  | 'social_links' | 'gallery' | 'video' | 'cta' | 'text' | 'pdf' | 'faq'
  | 'stats' | 'map' | 'hours' | 'reviews'
  | 'spotify_track' | 'spotify_playlist' | 'spotify_album'
  | 'menu' | 'promotion' | 'coupon' | 'order_link'
  | 'blood_type' | 'allergies' | 'emergency_contact' | 'medical_conditions' | 'medications'
  | 'certificate' | 'course' | 'achievement' | 'project' | 'skill_set';

export interface CardBlock {
  id: string;
  type: BlockType;
  position: number;
  visible: boolean;
  config: Record<string, unknown>;
}

export interface CardSettings {
  save_contact_btn: boolean;
  analytics_enabled: boolean;
  whatsapp_button: boolean;
  whatsapp_message?: string;
  auto_dark_mode: boolean;
  animations: boolean;
  seo_enabled: boolean;
  password_protected: boolean;
  show_emergency_banner: boolean;
  realtime_enabled: boolean;
  theme_color?: string;
  access_password?: string;
  card_style?: string;     // dark | glass | neon | gradient | light | aurora
  profile_layout?: string; // standard | centered | banner | minimal
  font_style?: string;     // outfit | syne | inter | playfair | mono
  show_online_status: boolean;
  require_check_in: boolean;
}

export const defaultSettings: CardSettings = {
  save_contact_btn: true,
  analytics_enabled: true,
  whatsapp_button: true,
  auto_dark_mode: true,
  animations: true,
  seo_enabled: true,
  password_protected: false,
  show_emergency_banner: false,
  realtime_enabled: false,
  show_online_status: false,
  require_check_in: false,
};

export interface CardProps {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  type: CardType;
  status: CardStatus;
  theme: string;
  blocks: CardBlock[];
  settings: CardSettings;
  cover_gradient: string;
  full_name: string | null;
  role: string | null;
  company: string | null;
  bio: string | null;
  avatar_emoji: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  address: string | null;
  public_url: string;
  scan_count: number;
  created_at: string;
  updated_at: string;
}

export class CardEntity {
  private constructor(private readonly props: CardProps) {}

  static create(props: CardProps): CardEntity {
    return new CardEntity(props);
  }

  get id() { return this.props.id; }
  get userId() { return this.props.user_id; }
  get name() { return this.props.name; }
  get slug() { return this.props.slug; }
  get type() { return this.props.type; }
  get status() { return this.props.status; }
  get blocks() { return this.props.blocks; }
  get settings() { return this.props.settings; }
  get publicUrl() { return this.props.public_url; }
  get scanCount() { return this.props.scan_count; }

  isActive(): boolean { return this.props.status === 'active'; }
  isMedical(): boolean { return this.props.type === 'medical'; }
  isRestaurant(): boolean { return this.props.type === 'restaurant'; }
  isAcademic(): boolean { return this.props.type === 'academic'; }

  toJSON(): CardProps { return { ...this.props }; }
}
