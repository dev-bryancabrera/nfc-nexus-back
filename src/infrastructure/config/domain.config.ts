export type DomainMode = 'path' | 'subdomain';

export const domainConfig = {
  mode: (process.env.DOMAIN_MODE || 'path') as DomainMode,
  rootDomain: process.env.ROOT_DOMAIN || 'nexusnfc.com',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',

  buildPublicUrl(slug: string): string {
    if (this.mode === 'subdomain') {
      const base = this.frontendUrl.replace(/^https?:\/\//, '');
      const proto = this.frontendUrl.startsWith('https') ? 'https' : 'http';
      return `${proto}://${slug}.${base}`;
    }
    return `${this.frontendUrl}/u/${slug}`;
  },

  extractSlugFromHost(host: string): string | null {
    if (this.mode !== 'subdomain') return null;
    const parts = host.split('.');
    return parts.length >= 3 ? parts[0] : null;
  },
};
