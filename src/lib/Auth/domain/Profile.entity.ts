export interface ProfileProps {
  id: string;
  user_id: string;
  username: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  avatar_emoji: string | null;
  plan: 'free' | 'pro' | 'enterprise';
  domain_mode: 'path' | 'subdomain';
  custom_domain: string | null;
  created_at: string;
  updated_at: string;
}
