'use client';

import { usePathname } from 'next/navigation';
import BaseNavBar from './BaseNavBar';
import { useUserInfoContext } from "@/contexts/UserInfoContext";
import userPermissions from '@/contexts/permissionsConfig';

export default function NavBarWrapper() {
  const { user } = useUserInfoContext();

  const pathname = usePathname();
  const isPlatformRoute = pathname && pathname.includes('/platform');

  return isPlatformRoute ? <NavBarPlataform user={user} /> : <NavBar />;
}

export function NavBar() {
  const mainMenu = [
    { id: 'home', route: '/', text: 'Inicio' },
    { id: 'platform', route: '/platform', text: 'Plataforma' }
  ];

  const toggleMenuItems = [
    { id: 'home', route: '/', text: 'Inicio' },
    { id: 'platform', route: '/platform', text: 'Plataforma' },
  ];

  return <BaseNavBar mainMenu={mainMenu} toggleMenuItems={toggleMenuItems} />;
}

export function NavBarPlataform({ user }) {
  const isLoggedIn = !!user;
  const mainMenu = [
    { id: 'home', route: '/', text: 'Inicio' },
    { id: 'platform', route: '/platform', text: 'Plataforma' }
  ];

  let toggleMenuItems = [
    { id: 'home', route: '/', text: 'Inicio' },
    { id: 'platform', route: '/platform', text: 'Plataforma' }
  ];

  if (isLoggedIn) {
    const subMenuItems = [];

    const allowedPermissions = userPermissions[user.user_role_id] || [];

    // Get all routes if the user is root (user role 4)
    if (user.user_role_id === 6) {
      Object.values(userPermissions).forEach(routes => {
        routes.forEach(({ group, route, name }) => {
          if (!subMenuItems.some(item => item.route === route)) {
            subMenuItems.push({ group, route, text: name });
          }
        });
      });
    } else {
      allowedPermissions.forEach(({ group, name, route }) => {
        if (!subMenuItems.some(item => item.route === route)) {
          subMenuItems.push({ group, route, text: name });
        }
      });
    }

    const filteredToggleMenuItems = [];

    const stockSubMenu = subMenuItems.filter(item => item.group === 'stock');
    if (stockSubMenu.length > 0) {
      filteredToggleMenuItems.push({
        id: 'stock',
        route: '#',
        text: 'Stock',
        subMenu: stockSubMenu
      });
    }

    const usersSubMenu = subMenuItems.filter(item => item.group === 'users');
    if (usersSubMenu.length > 0) {
      filteredToggleMenuItems.push({
        id: 'users',
        route: '#',
        text: 'Usuarios',
        subMenu: usersSubMenu,
      });
    }

    filteredToggleMenuItems.unshift(
      { id: 'home', route: '/', text: 'Inicio' },
      { id: 'platform', route: '/platform', text: 'Plataforma' }
    );

    toggleMenuItems = filteredToggleMenuItems;
  }

  const loginInfo = { route: '/platform/login', text: 'Acceder a la plataforma' };

  return <BaseNavBar mainMenu={mainMenu} toggleMenuItems={toggleMenuItems} loginInfo={isLoggedIn ? null : loginInfo} />;
}
