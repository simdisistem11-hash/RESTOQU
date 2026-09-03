import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RestoQu - Restaurant Management System & Operating System SaaS',
  description: 'Operating System Restoran Multi-Tenant modern berbasis Mobile-First: QR Ordering, Group Session, KDS, POS Kasir, Calling System, dan Waiter Queue.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
