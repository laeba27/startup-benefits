'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  BookOpen,
  Zap,
  Settings,
  Shield,
  Bell,
  Lock,
  HelpCircle,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
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

  const usageGuides = [
    {
      icon: Zap,
      title: 'Getting Started',
      description: 'Learn how to set up your account and claim your first deal',
      steps: [
        'Create your account with your email',
        'Verify your email address',
        'Complete your profile with company details',
        'Start exploring available deals',
      ],
    },
    {
      icon: BookOpen,
      title: 'How to Claim a Deal',
      description: 'Step-by-step guide to claiming deals and tracking your benefits',
      steps: [
        'Browse available deals on the Deals page',
        'Click on a deal to view details',
        'Click "Claim Deal" to claim it',
        'Track your claim status in the Claims section',
        'Once approved, view your savings on the Dashboard',
      ],
    },
    {
      icon: Shield,
      title: 'Claim Management',
      description: 'Understand different claim statuses and what they mean',
      steps: [
        'Pending: Awaiting verification from admin',
        'Approved: Claim verified, benefit is active',
        'Rejected: Claim was not approved, check details',
        'View claim history in Dashboard > Claims',
      ],
    },
    {
      icon: HelpCircle,
      title: 'Dashboard Overview',
      description: 'Navigate and understand your dashboard statistics',
      steps: [
        'Claims Claimed: Total number of deals you claimed',
        'Active Deals: Number of approved claims with active benefits',
        'Pending Claims: Claims awaiting approval',
        'Total Savings: Sum of values from your approved deals',
        'Available Deals: Deals you can still claim',
      ],
    },
  ];

  const comingSoonFeatures = [
    {
      title: 'Advanced Analytics',
      description: 'Detailed insights into your savings and deal performance',
      icon: BarChart3Icon,
    },
    {
      title: 'Deal Recommendations',
      description: 'AI-powered personalized deal suggestions based on your profile',
      icon: Zap,
    },
    {
      title: 'Claim Reminders',
      description: 'Get notified when your claimed deals are about to expire',
      icon: Bell,
    },
    {
      title: 'Multi-Account Support',
      description: 'Manage deals for multiple team members in one place',
      icon: Settings,
    },
    {
      title: 'Export Reports',
      description: 'Download your savings and claim history as reports',
      icon: BookOpen,
    },
    {
      title: 'Integration Webhooks',
      description: 'Connect with external tools and services',
      icon: Lock,
    },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-8"
    >
      {/* Header */}
      <motion.div variants={item}>
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your preferences and learn how to use the platform
          </p>
        </div>
      </motion.div>

      {/* How to Use This Website */}
      <motion.div variants={item}>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              How to Use This Website
            </h2>
            <p className="text-gray-600 mb-6">
              Get started with Startup Benefits and learn how to maximize your deal benefits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {usageGuides.map((guide, index) => {
              const Icon = guide.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <Icon className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{guide.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{guide.description}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {guide.steps.map((step, stepIndex) => (
                      <div key={stepIndex} className="flex gap-3 text-sm">
                        <span className="text-blue-600 font-semibold min-w-fit">
                          {stepIndex + 1}.
                        </span>
                        <p className="text-gray-700">{step}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* FAQ Section */}
      <motion.div variants={item}>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-blue-600" />
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            <details className="group cursor-pointer">
              <summary className="flex items-center justify-between py-4 px-4 bg-white rounded-lg border border-gray-200 font-semibold text-gray-900 hover:bg-gray-50 transition-colors">
                <span>What is Startup Benefits?</span>
                <ChevronRight className="w-5 h-5 transform group-open:rotate-90 transition-transform" />
              </summary>
              <div className="px-4 py-4 text-gray-700 bg-gray-50 border border-gray-200 border-t-0 rounded-b-lg">
                Startup Benefits is a platform that helps startups access exclusive deals and
                discounts from various service providers. Claim deals, track your benefits, and
                maximize your savings.
              </div>
            </details>

            <details className="group cursor-pointer">
              <summary className="flex items-center justify-between py-4 px-4 bg-white rounded-lg border border-gray-200 font-semibold text-gray-900 hover:bg-gray-50 transition-colors">
                <span>How long does it take to get a claim approved?</span>
                <ChevronRight className="w-5 h-5 transform group-open:rotate-90 transition-transform" />
              </summary>
              <div className="px-4 py-4 text-gray-700 bg-gray-50 border border-gray-200 border-t-0 rounded-b-lg">
                Claims are typically reviewed and approved within 1-2 business days. You can
                track the status of your claims in the Claims section of your dashboard.
              </div>
            </details>

            <details className="group cursor-pointer">
              <summary className="flex items-center justify-between py-4 px-4 bg-white rounded-lg border border-gray-200 font-semibold text-gray-900 hover:bg-gray-50 transition-colors">
                <span>Can I claim multiple deals from the same company?</span>
                <ChevronRight className="w-5 h-5 transform group-open:rotate-90 transition-transform" />
              </summary>
              <div className="px-4 py-4 text-gray-700 bg-gray-50 border border-gray-200 border-t-0 rounded-b-lg">
                Yes! You can claim multiple different deals. However, you can only claim each
                specific deal once. If you need additional licenses, contact the company directly.
              </div>
            </details>

            <details className="group cursor-pointer">
              <summary className="flex items-center justify-between py-4 px-4 bg-white rounded-lg border border-gray-200 font-semibold text-gray-900 hover:bg-gray-50 transition-colors">
                <span>What if my claim is rejected?</span>
                <ChevronRight className="w-5 h-5 transform group-open:rotate-90 transition-transform" />
              </summary>
              <div className="px-4 py-4 text-gray-700 bg-gray-50 border border-gray-200 border-t-0 rounded-b-lg">
                If your claim is rejected, you can view the rejection reason in your Claims
                history. Review the deal requirements and try claiming again if eligible.
              </div>
            </details>
          </div>
        </div>
      </motion.div>

      {/* Coming Soon Section */}
      <motion.div variants={item}>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-orange-600" />
              Coming Soon
            </h2>
            <p className="text-gray-600 mb-6">
              Exciting new features are on the way to enhance your experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {comingSoonFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-orange-200 rounded-full opacity-20 -mr-10 -mt-10 group-hover:scale-110 transition-transform" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                      <feature.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-semibold bg-orange-600 text-white px-2 py-1 rounded-full">
                      Coming Soon
                    </span>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-700">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Account Settings (Placeholder) */}
      <motion.div variants={item}>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Settings className="w-5 h-5 text-gray-600" />
            Account Settings
          </h2>

          <div className="space-y-4">
            <Link href="/dashboard/profile">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div>
                  <h3 className="font-semibold text-gray-900">Edit Profile</h3>
                  <p className="text-sm text-gray-600">Update your personal information</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </Link>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg opacity-50 cursor-not-allowed">
              <div>
                <h3 className="font-semibold text-gray-900">Privacy Settings</h3>
                <p className="text-sm text-gray-600">Manage your privacy preferences</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-400">Coming Soon</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg opacity-50 cursor-not-allowed">
              <div>
                <h3 className="font-semibold text-gray-900">Notification Preferences</h3>
                <p className="text-sm text-gray-600">Manage how you receive notifications</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-400">Coming Soon</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg opacity-50 cursor-not-allowed">
              <div>
                <h3 className="font-semibold text-gray-900">Security</h3>
                <p className="text-sm text-gray-600">Change password and security settings</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-400">Coming Soon</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Support Section */}
      <motion.div variants={item}>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Need Help?</h2>
          <p className="text-gray-700 mb-4">
            Can't find what you're looking for? Check out our resources or contact support.
          </p>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Contact Support
            </button>
            <button className="px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors">
              View Documentation
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Icon component for bar chart (alternative if Zap is used elsewhere)
function BarChart3Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 3v18h18" />
      <path d="M7 16v-4" />
      <path d="M11 16v-8" />
      <path d="M15 16v-3" />
      <path d="M19 16v-6" />
    </svg>
  );
}
