import { prisma } from '@restoqu/database';

export interface TenantContext {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  primaryColor: string;
  secondaryColor: string;
  currency: string;
  taxPercentage: number;
  servicePercentage: number;
}

export async function getTenantBySlug(slug: string): Promise<TenantContext | null> {
  try {
    const tenant = await prisma.tenant.findUnique({
      where: { slug },
      include: { settings: true }
    });

    if (!tenant || tenant.status !== 'ACTIVE') {
      return null;
    }

    return {
      id: tenant.id,
      name: tenant.name,
      slug: tenant.slug,
      logoUrl: tenant.logoUrl,
      primaryColor: tenant.primaryColor,
      secondaryColor: tenant.secondaryColor,
      currency: tenant.settings?.currency || 'IDR',
      taxPercentage: tenant.settings?.taxPercentage || 10.0,
      servicePercentage: tenant.settings?.servicePercentage || 5.0
    };
  } catch (error) {
    console.error('[getTenantBySlug error]:', error);
    return null;
  }
}
