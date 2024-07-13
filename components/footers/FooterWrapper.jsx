'use client';

import { usePathname } from 'next/navigation';

import BaseFooter from './BaseFooter';

export default function FooterWrapper() {
  const pathname = usePathname();
  const isPlatformRoute = pathname && pathname.includes('/platform');

  return isPlatformRoute ? <FooterPlataform /> : <Footer />;
}

export function Footer() {
  const items = [
    { route: '/about', text: 'Sobre nosotros' },
    { route: '/terms', text: 'Terminos y condiciones' },
    { route: '/contact', text: 'Contacto' },

  ];

  return <BaseFooter items={items} />;
}

export function FooterPlataform() {
  const items = [
    { route: '/about', text: 'Sobre nosotros' },
    { route: '/contact', text: 'Contacto' },
    { route: '/terms', text: 'Terminos y condiciones' },
  ];

  return <BaseFooter items={items} />;
}