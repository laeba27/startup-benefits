'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfileRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard profile
    router.replace('/dashboard/profile');
  }, [router]);

  return null;
}
