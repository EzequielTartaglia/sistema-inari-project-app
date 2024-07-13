'use client';

import { createContext, useContext, useEffect } from "react";
import { useUserInfo } from "@/src/helpers/useUserInfo";
import { useRouter, usePathname } from 'next/navigation';

const UserInfoContext = createContext();

export const useUserInfoContext = () => useContext(UserInfoContext);

export const UserInfoProvider = ({ children }) => {
  const pathname = usePathname();

  const { user, loading, userLogout } = useUserInfo();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user && pathname.startsWith('/platform')) {
      router.push('/platform'); 
    }
  }, [user, loading, router, pathname]);

  return (
    <UserInfoContext.Provider value={{ user, userLogout }}>
      {children}
    </UserInfoContext.Provider>
  );
};
