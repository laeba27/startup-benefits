'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { BarChart3, CheckCircle2, Clock, Zap, TrendingUp, Loader2, AlertCircle } from 'lucide-react';
import { UserSummaryCard } from '@/components/dashboard/home/UserSummaryCard';
import { StatsCard } from '@/components/dashboard/home/StatsCard';
import Link from 'next/link';

interface DashboardStats {
  totalClaimsClaimed: number;
  activeDeals: number;
  pendingClaims: number;
  totalSavings: number;
  availableDeals: number;
  publicDeals: number;
}

interface Claim {
  _id: string;
  dealId: {
    _id: string;
    title: string;
    company: string;
    value: number;
    category: string;
    slug: string;
    discount: number;
  };
  status: 'pending' | 'approved' | 'rejected';
  claimedAt: string;
}

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalClaimsClaimed: 0,
    activeDeals: 0,
    pendingClaims: 0,
    totalSavings: 0,
    availableDeals: 0,
    publicDeals: 0,
  });
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Get accessToken from localStorage (set by AuthContext)
        const accessToken = localStorage.getItem('accessToken');
        
        if (!accessToken) {
          throw new Error('No access token found');
        }

        // Fetch stats
        const statsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (!statsResponse.ok) {
          console.error('Dashboard API error:', statsResponse.status, statsResponse.statusText);
          throw new Error(`Failed to fetch dashboard data: ${statsResponse.status}`);
        }

        const statsData = await statsResponse.json();
        setStats(statsData.data.stats);

        // Fetch user claims
        const claimsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/claims/my`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (claimsResponse.ok) {
          const claimsData = await claimsResponse.json();
          const userClaims = claimsData.data.claims || [];
          // Sort by most recent first and get top 5
          setClaims(userClaims.sort((a: Claim, b: Claim) => 
            new Date(b.claimedAt).getTime() - new Date(a.claimedAt).getTime()
          ).slice(0, 5));
        }
      } catch (err) {
        console.error('Error fetching dashboard:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={item}>
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome back, {user?.profile?.name?.split(' ')[0] || 'there'}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Here's your startup benefits dashboard overview
          </p>
        </div>
      </motion.div>

      {/* User Summary Card */}
      <motion.div variants={item}>
        <UserSummaryCard />
      </motion.div>

      {/* Statistics Grid */}
      <motion.div variants={item}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            icon={CheckCircle2}
            label="Claims Claimed"
            value={stats.totalClaimsClaimed}
            color="bg-green-50"
            iconColor="text-green-600"
          />
          <StatsCard
            icon={TrendingUp}
            label="Active Deals"
            value={stats.activeDeals}
            color="bg-blue-50"
            iconColor="text-blue-600"
          />
          <StatsCard
            icon={Clock}
            label="Pending Claims"
            value={stats.pendingClaims}
            color="bg-orange-50"
            iconColor="text-orange-600"
          />
          <StatsCard
            icon={Zap}
            label="Total Savings"
            value={`$${stats.totalSavings}`}
            color="bg-purple-50"
            iconColor="text-purple-600"
          />
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={item}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center space-x-3 mb-3">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Available Deals</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.availableDeals}</p>
            <p className="text-sm text-gray-600 mt-1">
              {stats.publicDeals} public deals available
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center space-x-3 mb-3">
              <Zap className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">Platform Value</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">$107K+</p>
            <p className="text-sm text-gray-600 mt-1">
              Total value in available deals
            </p>
          </div>
        </div>
      </motion.div>

      {/* Recent Claims */}
      {claims.length > 0 && (
        <motion.div variants={item}>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Recent Claims</h3>
              <Link href="/dashboard/claims">
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All →
                </button>
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Slug</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Category</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Discount</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Value</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Claimed Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {claims.map((claim, index) => (
                    <motion.tr
                      key={claim._id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <Link href={`/deals/${claim.dealId?.slug}`}>
                          <span className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer">
                            {claim.dealId?.slug}
                          </span>
                        </Link>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium capitalize">
                          {claim.dealId?.category}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-gray-900">{claim.dealId?.discount}%</span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-900">${claim.dealId?.value}</td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(claim.claimedAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          claim.status === 'approved' ? 'bg-green-100 text-green-700' :
                          claim.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {error && (
        <motion.div
          variants={item}
          className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800"
        >
          {error}
        </motion.div>
      )}
    </motion.div>
  );
}
