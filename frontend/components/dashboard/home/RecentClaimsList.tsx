'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export function RecentClaimsList() {
  // Placeholder - will be connected to backend later
  const claims: any[] = [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
    >
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900">Recent Claims</h3>
      </div>

      {claims.length === 0 ? (
        <div className="p-8 text-center text-gray-600">
          <p>No claims to display yet</p>
          <Link href="/deals" className="text-blue-600 hover:underline mt-2 inline-block">
            Explore deals →
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {claims.map((claim) => (
            <div key={claim._id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-between space-x-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{claim.dealName}</h4>
                  <p className="text-sm text-gray-600">{claim.company}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">${claim.value}</p>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      claim.status === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : claim.status === 'pending'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {claim.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
