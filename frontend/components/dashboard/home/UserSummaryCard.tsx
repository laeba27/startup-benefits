'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { CheckCircle2, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export function UserSummaryCard() {
  const { user } = useAuth();

  // Generate avatar initials
  const getInitials = () => {
    if (!user?.profile?.name) return 'U';
    const parts = user.profile.name.trim().split(/\s+/).filter((n) => n.length > 0);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0]?.slice(0, 2).toUpperCase() || 'U';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200 shadow-sm"
    >
      <div className="flex items-start space-x-6">
        {/* Avatar */}
        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md">
          {getInitials()}
        </div>

        {/* User Info */}
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h2 className="text-2xl font-bold text-gray-900">{user?.profile?.name}</h2>
            <div className="flex items-center space-x-1 bg-green-100 px-3 py-1 rounded-full">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-xs font-semibold text-green-700">Verified</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-gray-600">
              <Mail className="w-4 h-4" />
              <span className="text-sm">{user?.email}</span>
            </div>

            {/* Additional Info */}
            <div className="mt-3 pt-3 border-t border-blue-200 grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-600 uppercase font-semibold">Company</p>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {user?.profile?.company || 'Not specified'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase font-semibold">Role</p>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {user?.profile?.role || 'Founder'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase font-semibold">Phone</p>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {'Not provided'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Button */}
        <Link href="/dashboard/profile">
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 whitespace-nowrap">
            Edit Profile
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
