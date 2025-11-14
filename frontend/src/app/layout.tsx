import '@/src/styles/globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Helpclub Marketplace',
  description: 'Connect clients and freelancers globally'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
            <span className="text-lg font-semibold">Helpclub</span>
            <nav className="space-x-4 text-sm">
              <a href="/" className="hover:underline">
                Marketplace
              </a>
              <a href="/projects" className="hover:underline">
                Projects
              </a>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
      </body>
    </html>
  );
}
