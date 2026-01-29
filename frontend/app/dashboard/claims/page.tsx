'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Loader2, ArrowLeft, Filter, Search, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';

export default function DashboardClaimsPage() {
  const { user, isAuthenticated } = useAuth();
  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          throw new Error('No access token found');
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/claims/my`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          // Map the response to match the expected format
          const mappedClaims = (data.data.claims || []).map((claim: any) => ({
            _id: claim._id,
            dealName: claim.dealId?.slug || 'Unknown Deal',
            company: claim.dealId?.discount || 'Unknown Company',
            category: claim.dealId?.category || 'Other',
            status: claim.status,
            claimDate: claim.claimedAt || claim.createdAt,
            expirationDate: claim.dealId?.expirationDate,
            couponCode: claim.dealId?.couponCode || 'N/A',
            value: claim.dealId?.value || 0,
            dealId: claim.dealId?._id,
          }));
          setClaims(mappedClaims);
        }
      } catch (error) {
        console.error('Error fetching claims:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchClaims();
    }
  }, [isAuthenticated]);

  const filteredClaims = claims.filter((claim) => {
    const matchesSearch =
      claim.dealName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.company?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || claim.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-orange-100 text-orange-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center space-x-3 mb-8">
        <Link href="/dashboard">
          <motion.button
            whileHover={{ x: -4 }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </motion.button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Claims</h1>
          <p className="text-gray-600 mt-1">Track all your claimed deals and their status</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search deals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Claims Table */}
      {filteredClaims.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Deal Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Discount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Value</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Claimed Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Expires</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredClaims.map((claim, index) => (
                  <motion.tr
                    key={claim._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                     <p className="font-semibold text-gray-900">
  {claim.dealName
    .replace(/-/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase())}
</p>

                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600 text-sm">{claim.company}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                        {claim.category || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">${claim.value}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600 text-sm">
                        {new Date(claim.claimDate).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                          claim.status
                        )}`}
                      >
                        {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600 text-sm">
                        {new Date(claim.expirationDate).toLocaleDateString()}
                      </p>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl p-12 border border-gray-200 text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-100 rounded-full">
              <ShoppingBag className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No Claims Found</h3>
          <p className="text-gray-600 mb-6">
            {claims.length === 0
              ? "You haven't claimed any deals yet."
              : 'No claims match your search criteria.'}
          </p>
          <Link href="/deals">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Explore Deals
            </Button>
          </Link>
        </motion.div>
      )}

      {/* Summary Stats */}
      {claims.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200"
        >
          <h3 className="font-semibold text-gray-900 mb-4">Claims Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-2xl font-bold text-gray-900">{claims.length}</p>
              <p className="text-sm text-gray-600">Total Claims</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {claims.filter((c) => c.status === 'approved').length}
              </p>
              <p className="text-sm text-gray-600">Approved</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">
                {claims.filter((c) => c.status === 'pending').length}
              </p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                ${claims.reduce((sum, c) => sum + (c.value || 0), 0)}
              </p>
              <p className="text-sm text-gray-600">Total Value</p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
