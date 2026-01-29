'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from '@/components/ui/Toast';
import { Loader2, Save, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface ProfileData {
  name?: string;
  phone?: string;
  company?: string;
  role?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export default function DashboardProfilePage() {
  const { user, token, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [formData, setFormData] = useState<ProfileData>({
    name: '',
    phone: '',
    company: '',
    role: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  const [adminVerified, setAdminVerified] = useState(false);

  // Fetch profile data on mount
  useEffect(() => {
    fetchProfile();
  }, [token]);

  const fetchProfile = async () => {
    try {
      setIsFetching(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      const userData = data.data.user;

      setFormData({
        name: userData.profile?.name || '',
        phone: userData.profile?.phone || '',
        company: userData.profile?.company || '',
        role: userData.profile?.role || '',
        address: userData.profile?.address || '',
        city: userData.profile?.city || '',
        state: userData.profile?.state || '',
        zipCode: userData.profile?.zipCode || '',
        country: userData.profile?.country || '',
      });

      setAdminVerified(userData.adminVerified || false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to load profile',
        type: 'error',
      });
    } finally {
      setIsFetching(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const data = await response.json();
      setFormData({
        name: data.data.user.profile?.name || '',
        phone: data.data.user.profile?.phone || '',
        company: data.data.user.profile?.company || '',
        role: data.data.user.profile?.role || '',
        address: data.data.user.profile?.address || '',
        city: data.data.user.profile?.city || '',
        state: data.data.user.profile?.state || '',
        zipCode: data.data.user.profile?.zipCode || '',
        country: data.data.user.profile?.country || '',
      });

      toast({
        title: 'Success',
        description: 'Profile updated successfully!',
        type: 'success',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update profile',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl"
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
          <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
          <p className="text-gray-600 mt-1">Update your personal and business information</p>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-8 space-y-8">
        {/* Personal Information Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <Input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Main Street"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <Input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="New York"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <Input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="NY"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zip Code
                </label>
                <Input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="10001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <Input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="United States"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Company Information Section */}
        <div className="pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <Input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Acme Inc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title / Role
              </label>
              <Input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="Founder & CEO"
              />
            </div>
          </div>
        </div>

        {/* Account Information Section */}
        <div className="pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div>
                <p className="font-medium text-green-900">Email Verification</p>
                <p className="text-sm text-green-700">Your email has been verified</p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>

            <div className={`flex items-center justify-between p-3 rounded-lg border ${
              adminVerified
                ? 'bg-blue-50 border-blue-200'
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div>
                <p className={`font-medium ${adminVerified ? 'text-blue-900' : 'text-gray-900'}`}>
                  Admin Verification
                </p>
                <p className={`text-sm ${adminVerified ? 'text-blue-700' : 'text-gray-600'}`}>
                  {adminVerified
                    ? 'Your account has been verified by our admin team'
                    : 'Pending admin verification for restricted deals'}
                </p>
              </div>
              {adminVerified && <CheckCircle className="w-6 h-6 text-blue-600" />}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-gray-200 flex gap-3 justify-end">
          <Link href="/dashboard">
            <Button variant="outline" className="text-gray-700 border-gray-300">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
