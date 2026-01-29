'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from '@/components/ui/Toast';
import {
  Loader2,
  Search,
  Filter,
  Lock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Gift,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

interface Deal {
  _id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: string;
  value: number;
  discount: number;
  company: string;
  logo: string;
  link: string;
  couponCode?: string;
  isLocked: boolean;
  eligibilityText?: string;
  expirationDate: string;
  requirements?: string[];
  benefits?: string[];
  tags?: string[];
  isFeatured?: boolean;
}

const CATEGORIES = [
  'devtools',
  'analytics',
  'design',
  'marketing',
  'productivity',
  'cloud',
  'security',
  'database',
  'devops',
  'other',
];

export default function DealsPage() {
  const { isAuthenticated, user, token } = useAuth();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [filteredDeals, setFilteredDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showLocked, setShowLocked] = useState(false);
  const [claimingDealId, setClaimingDealId] = useState<string | null>(null);
  const [userClaims, setUserClaims] = useState<{ [key: string]: string }>({});

  // Fetch deals
  useEffect(() => {
    fetchDeals();
    if (isAuthenticated) {
      fetchUserClaims();
    }
  }, [isAuthenticated]);

  const fetchDeals = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/deals`);

      if (!response.ok) {
        throw new Error('Failed to fetch deals');
      }

      const data = await response.json();
      setDeals(data.data || data);
      setFilteredDeals(data.data || data);
    } catch (error) {
      console.error('Error fetching deals:', error);
      toast({
        title: 'Error',
        description: 'Failed to load deals',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserClaims = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) return;

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

      if (!response.ok) return;

      const data = await response.json();
      const claims = data.data.claims || [];
      
      // Create a map of dealId -> status
      const claimsMap: { [key: string]: string } = {};
      claims.forEach((claim: any) => {
        claimsMap[claim.dealId._id] = claim.status;
      });
      setUserClaims(claimsMap);
    } catch (error) {
      console.error('Error fetching user claims:', error);
    }
  };

  // Filter deals based on search and category
  useEffect(() => {
    let filtered = deals;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (deal) =>
          deal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          deal.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          deal.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((deal) => deal.category === selectedCategory);
    }

    // Filter by locked status
    if (showLocked) {
      filtered = filtered.filter((deal) => deal.isLocked);
    }

    setFilteredDeals(filtered);
  }, [searchTerm, selectedCategory, showLocked, deals]);

  const handleClaimDeal = async (deal: Deal) => {
    if (!isAuthenticated) {
      toast({
        title: 'Login Required',
        description: 'Please sign in to claim deals',
        type: 'error',
      });
      return;
    }

    if (!user?.isVerified) {
      toast({
        title: 'Verification Required',
        description: 'Please verify your email to claim deals',
        type: 'error',
      });
      return;
    }

    if (deal.isLocked && !user?.adminVerified) {
      toast({
        title: 'Admin Verification Required',
        description: 'This is a restricted deal. Admin verification is required.',
        type: 'error',
      });
      return;
    }

    try {
      setClaimingDealId(deal._id);

      // Get access token
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('No access token found');
      }

      // Call backend to create claim
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/claims`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          dealId: deal._id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to claim deal');
      }

      const data = await response.json();

      toast({
        title: 'Deal Claimed Successfully!    ',
        description: 'Your claim is now pending. Admin will review and approve/reject it shortly.',
        type: 'success',
      });

      // Update user claims
      setUserClaims({
        ...userClaims,
        [deal._id]: 'pending',
      });
    } catch (error: any) {
      console.error('Error claiming deal:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to claim deal',
        type: 'error',
      });
    } finally {
      setClaimingDealId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm"
      >
        {/* Search + Inline Filters */}
<div className="flex p-4 flex-col md:flex-row gap-3 items-stretch md:items-center">

  {/* Search */}
  <div className="relative flex-1">
    <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
    <Input
      type="text"
      placeholder="Search deals..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="pl-10 pr-3"
    />
  </div>

  {/* Category */}
  <select
    value={selectedCategory}
    onChange={(e) => setSelectedCategory(e.target.value)}
    className="h-10 px-3 border border-gray-300 rounded-lg text-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
  >
    <option value="">All</option>
    {CATEGORIES.map((cat) => (
      <option key={cat} value={cat}>
        {cat.charAt(0).toUpperCase() + cat.slice(1)}
      </option>
    ))}
  </select>

  {/* Restricted Toggle */}
  <label className="flex items-center gap-2 h-10 px-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 whitespace-nowrap">
    <input
      type="checkbox"
      checked={showLocked}
      onChange={(e) => setShowLocked(e.target.checked)}
      className="w-4 h-4"
    />
    <span className="text-sm font-medium text-gray-700">
      Restricted
    </span>
  </label>

  {/* Clear */}
  {(searchTerm || selectedCategory || showLocked) && (
    <button
      onClick={() => {
        setSearchTerm('');
        setSelectedCategory('');
        setShowLocked(false);
      }}
      className="text-sm text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap"
    >
      Clear
    </button>
  )}

{/* Result Count */}
<p className="text-sm  text-gray-600 px-4">
  Showing {filteredDeals.length} of {deals.length} deals
</p>
</div>


      </motion.div>

      {/* Deals Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredDeals.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No deals found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDeals.map((deal, index) => (
              <motion.div
                key={deal._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 overflow-hidden group"
              >
                {/* Deal Header */}
                <div className="p-6 pb-4 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {deal.isFeatured && (
                          <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">
                            ⭐ Featured
                          </span>
                        )}
                        {deal.isLocked && (
                          <span className="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            Restricted
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {deal.name}
                      </h3>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{deal.company}</p>
                </div>

                {/* Deal Content */}
                <div className="p-6 space-y-4">
                  {/* Description */}
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {deal.shortDescription}
                  </p>

                  {/* Value */}
                  <div className="flex items-center gap-2 text-lg font-bold text-green-600">
                    <Gift className="w-5 h-5" />
                    ${deal.value.toLocaleString()}
                  </div>

                  {/* Category & Tags */}
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {deal.category}
                    </span>
                    {deal.tags?.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Expiration */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    Expires: {new Date(deal.expirationDate).toLocaleDateString()}
                  </div>

                  {/* Requirements */}
                  {deal.requirements && deal.requirements.length > 0 && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs font-semibold text-blue-900 mb-2">Requirements:</p>
                      <ul className="text-xs text-blue-800 space-y-1">
                        {deal.requirements.slice(0, 2).map((req, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <span className="mt-1">•</span>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Verification Status */}
                  {isAuthenticated && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-xs">
                        {user?.isVerified ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-green-800">Email Verified ✓</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-4 h-4 text-red-600" />
                            <span className="text-red-800">Email verification required</span>
                          </>
                        )}
                      </div>
                      {deal.isLocked && (
                        <div className="flex items-center gap-2 text-xs mt-2">
                          {user?.adminVerified ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span className="text-green-800">Admin Verified ✓</span>
                            </>
                          ) : (
                            <>
                              <Lock className="w-4 h-4 text-red-600" />
                              <span className="text-red-800">Admin verification needed</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="p-6 pt-4 border-t border-gray-100 space-y-2">
                  <Link href={`/deals/${deal.slug}`} className="block">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2">
                      <span>View Details</span>
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </Link>
                  <button
                    onClick={() => handleClaimDeal(deal)}
                    disabled={!isAuthenticated || !user?.isVerified || (deal.isLocked && !user?.adminVerified) || claimingDealId === deal._id || !!userClaims[deal._id]}
                    className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {claimingDealId === deal._id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Claiming...
                      </>
                    ) : userClaims[deal._id] ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Claimed ({userClaims[deal._id]})
                      </>
                    ) : !isAuthenticated ? (
                      'Sign In to Claim'
                    ) : !user?.isVerified ? (
                      'Verify Email to Claim'
                    ) : deal.isLocked && !user?.adminVerified ? (
                      'Admin Verification Required'
                    ) : (
                      'Claim Deal'
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}