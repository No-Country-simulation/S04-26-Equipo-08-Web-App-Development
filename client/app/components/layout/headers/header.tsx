'use client'

import React, { useEffect, useState } from 'react'
import PublicHeader from './public-header'
import DashboardHeader from './dashboard-header'
import AdminHeader from './admin-header'
import { useAuthStore } from '@/app/store/use-auth-store'

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return <PublicHeader />;
  }

  if (isAuthenticated && user?.role === 'admin') {
    return <AdminHeader />;
  }

  if (isAuthenticated) {
    return <DashboardHeader />;
  }

  return <PublicHeader />;
}
