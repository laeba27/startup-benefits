'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { toast } from '@/components/ui/Toast';
import {
  Loader2,
  ArrowLeft,
  ExternalLink,
  Lock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Building,
  Gift,
  Users,
  Target,
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

interface Claim {
  _id: string;
  status: 'pending' | 'approved' | 'rejected';
  claimedAt: string;
}

export default function DealDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClaiming, setIsClaiming] = useState(false);
  const [userClaim, setUserClaim] = useState<Claim | null>(null);

  const slug = params.slug as string;

  useEffect(() => {
    if (slug) {
      fetchDeal();
      if (isAuthenticated) {
        checkUserClaim();
      }
    }
  }, [slug, isAuthenticated]);

  const fetchDeal = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/deals/slug/${slug}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch deal');
      }

      const data = await response.json();
      setDeal(data.data);
    } catch (error) {
      console.error('Error fetching deal:', error);
      toast({
        title: 'Error',
        description: 'Failed to load deal details',
        type: 'error',
      });
      router.push('/deals');
    } finally {
      setIsLoading(false);
    }
  };

  const checkUserClaim = async () => {
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
      
      // Find claim for this deal
      const claim = claims.find((c: any) => c.dealId._id === deal?._id);
      if (claim) {
        setUserClaim({
          _id: claim._id,
          status: claim.status,
          claimedAt: claim.claimedAt,
        });
      }
    } catch (error) {
      console.error('Error checking user claim:', error);
    }
  };

  const handleClaimDeal = async () => {
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

    if (deal?.isLocked && !user?.adminVerified) {
      toast({
        title: 'Admin Verification Required',
        description: 'This is a restricted deal. Admin verification is required to claim.',
        type: 'error',
      });
      return;
    }

    try {
      setIsClaiming(true);

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
          dealId: deal?._id,
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

      // Set user claim status
      setUserClaim({
        _id: data.data.claim._id,
        status: data.data.claim.status,
        claimedAt: data.data.claim.claimedAt,
      });

      // Open deal link in new tab
      window.open(deal?.link, '_blank');
    } catch (error: any) {
      console.error('Error claiming deal:', error);
      
      let errorMessage = 'Failed to claim deal';
      if (error.message.includes('already claimed')) {
        errorMessage = 'You have already claimed this deal';
      }

      toast({
        title: 'Error',
        description: errorMessage,
        type: 'error',
      });
    } finally {
      setIsClaiming(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Deal not found</h1>
          <p className="text-gray-600 mb-4">The deal you're looking for doesn't exist.</p>
          <Link href="/deals">
            <Button>Back to Deals</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header with Back Button */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/deals" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to Deals
          </Link>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          {/* Deal Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  {deal.isFeatured && (
                    <span className="inline-block px-3 py-1 bg-yellow-400 text-yellow-900 text-sm font-semibold rounded-full">
                      Featured Deal
                    </span>
                  )}
                  {deal.isLocked && (
                    <span className="inline-block px-3 py-1 bg-red-400 text-red-900 text-sm font-semibold rounded-full flex items-center gap-1">
                      <Lock className="w-4 h-4" />
                      Restricted
                    </span>
                  )}
                </div>
                <h1 className="text-4xl font-bold mb-2">{deal.name}</h1>
                <p className="text-xl text-white/90">{deal.company}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-white/80">Deal Value</p>
                <p className="text-4xl font-bold">${deal.value.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Description Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">About This Deal</h2>
              <p className="text-gray-600 leading-relaxed text-lg">{deal.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Benefits */}
              {deal.benefits && deal.benefits.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Gift className="w-6 h-6 text-green-600" />
                    What You Get
                  </h3>
                  <ul className="space-y-3">
                    {deal.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements */}
              {deal.requirements && deal.requirements.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="w-6 h-6 text-blue-600" />
                    Requirements
                  </h3>
                  <ul className="space-y-3">
                    {deal.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-600 font-medium mb-1">Category</p>
                <p className="text-lg font-semibold text-blue-900">
                  {deal.category.charAt(0).toUpperCase() + deal.category.slice(1)}
                </p>
              </div>

              {/* Expiration */}
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-sm text-purple-600 font-medium mb-1 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Expires
                </p>
                <p className="text-lg font-semibold text-purple-900">
                  {new Date(deal.expirationDate).toLocaleDateString()}
                </p>
              </div>

              {/* Coupon Code */}
              {deal.couponCode && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-600 font-medium mb-1">Coupon Code</p>
                  <p className="text-lg font-mono font-bold text-green-900 break-all">
                    {deal.couponCode}
                  </p>
                </div>
              )}
            </div>

            {/* Tags */}
            {deal.tags && deal.tags.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {deal.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Eligibility */}
            <div className="p-6 bg-amber-50 rounded-lg border-2 border-amber-200">
              <h3 className="text-lg font-bold text-amber-900 mb-3 flex items-center gap-2">
                <Users className="w-6 h-6" />
                Eligibility Status
              </h3>
              <div className="space-y-3">
                {/* Claim Status */}
                {userClaim && (
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border-2 border-blue-200">
                    <div>
                      <p className="font-medium text-gray-900">Claim Status</p>
                      <p className="text-sm text-gray-600">
                        {new Date(userClaim.claimedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full font-semibold text-sm ${
                      userClaim.status === 'approved' ? 'bg-green-100 text-green-700' :
                      userClaim.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {userClaim.status.charAt(0).toUpperCase() + userClaim.status.slice(1)}
                    </div>
                  </div>
                )}

                {isAuthenticated ? (
                  <>
                    {/* Email Verification */}
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-100">
                      <div>
                        <p className="font-medium text-gray-900">Email Verification</p>
                        <p className="text-sm text-gray-600">Required to claim this deal</p>
                      </div>
                      {user?.isVerified ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <AlertCircle className="w-6 h-6 text-red-600" />
                      )}
                    </div>

                    {/* Admin Verification (if locked) */}
                    {deal.isLocked && (
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-100">
                        <div>
                          <p className="font-medium text-gray-900">Admin Verification</p>
                          <p className="text-sm text-gray-600">Required for restricted deals</p>
                        </div>
                        {user?.adminVerified ? (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : (
                          <AlertCircle className="w-6 h-6 text-red-600" />
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-amber-900">
                    Sign in to see your eligibility status for this deal
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t border-gray-200 p-8 bg-gray-50 flex gap-4">
            <Link href="/deals" className="flex-1">
              <Button variant="outline" className="w-full">
                View More Deals
              </Button>
            </Link>
            <button
              onClick={handleClaimDeal}
              disabled={
                !isAuthenticated ||
                !user?.isVerified ||
                (deal.isLocked && !user?.adminVerified) ||
                isClaiming ||
                !!userClaim
              }
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
            >
              {isClaiming ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Claiming...
                </>
              ) : userClaim ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Already Claimed ({userClaim.status})
                </>
              ) : !isAuthenticated ? (
                <>
                  <Lock className="w-5 h-5" />
                  Sign In to Claim
                </>
              ) : !user?.isVerified ? (
                <>
                  <AlertCircle className="w-5 h-5" />
                  Verify Email to Claim
                </>
              ) : deal.isLocked && !user?.adminVerified ? (
                <>
                  <Lock className="w-5 h-5" />
                  Admin Verification Required
                </>
              ) : (
                <>
                  <ExternalLink className="w-5 h-5" />
                  Claim Deal Now
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
