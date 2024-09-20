'use client';

import { usePathname } from 'next/navigation';
import BaseNavBar from './BaseNavBar';
import { useUserInfoContext } from "@/contexts/UserInfoContext";
import userPermissions from '@/contexts/permissionsConfig';
import { FaPencilAlt } from 'react-icons/fa';
import Logo from '../Logo';
import { FiBox, FiDollarSign, FiSettings, FiShoppingCart, FiUser } from 'react-icons/fi';

export default function NavBarWrapper() {
  const { user } = useUserInfoContext();

  const pathname = usePathname();
  const isPlatformRoute = pathname && pathname.includes('/platform');

  return isPlatformRoute ? <NavBarPlataform user={user} /> : <NavBar />;
}

export function NavBar() {
  const mainMenu = [
    { id: 'home', route: '/', text: 'Inicio' }
  ];

  const toggleMenuItems = [
    { id: 'home', route: '/', text: 'Inicio' },
    { id: 'platform', route: '/platform', text: 'Plataforma' }
  ];

  return <BaseNavBar mainMenu={mainMenu} toggleMenuItems={toggleMenuItems} />;
}

export function NavBarPlataform({ user }) {
  const isLoggedIn = !!user;
  const mainMenu = [];
  let toggleMenuItems = [];

  if (isLoggedIn) {
    const subMenuItems = [];

    const allowedPermissions = userPermissions[user.user_role_id] || [];

    if (user.user_role_id === 6) {
      Object.values(userPermissions).forEach(routes => {
        routes.forEach(({ group, route, name, icon }) => {
          if (!subMenuItems.some(item => item.route === route)) {
            subMenuItems.push({ group, route, text: name, icon });
          }
        });
      });
    } else {
      allowedPermissions.forEach(({ group, name, route, icon }) => {
        if (!subMenuItems.some(item => item.route === route)) {
          subMenuItems.push({ group, route, text: name, icon });
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
        icon: <FiBox />,
        subMenu: stockSubMenu
      });
    }

    const salesSubMenu = subMenuItems.filter(item => item.group === 'sales');
    if (salesSubMenu.length > 0) {
      filteredToggleMenuItems.push({
        id: 'sales',
        route: '#',
        text: 'Ventas',
        icon: <FiShoppingCart />,
        subMenu: salesSubMenu
      });
    }

    const usersSubMenu = subMenuItems.filter(item => item.group === 'users');
    if (usersSubMenu.length > 0) {
      filteredToggleMenuItems.push({
        id: 'users',
        route: '#',
        text: 'Datos',
        icon: <FiUser />,
        subMenu: usersSubMenu,
      });
    }

    const settingsSubMenu = subMenuItems.filter(item => item.group === 'settings');
    if (settingsSubMenu.length > 0) {
      filteredToggleMenuItems.push({
        id: 'settings',
        route: '#',
        text: 'Ajustes',
        icon: <FiSettings />,
        subMenu: settingsSubMenu,
      });
    }

    filteredToggleMenuItems.unshift(
      { id: 'home', route: '/', text: '', icon: <Logo />, },
      { id: 'platform', route: '/platform', text: 'Inicio', icon: <FaPencilAlt />, }
    );

    toggleMenuItems = filteredToggleMenuItems;
  }

  const loginInfo = { route: '/platform/login', text: 'Acceder a la plataforma' };

  return <BaseNavBar mainMenu={mainMenu} toggleMenuItems={toggleMenuItems} loginInfo={isLoggedIn ? null : loginInfo} />; 
}