'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export function EmptyClaimsState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl p-12 border border-gray-200 text-center"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="flex justify-center mb-6"
      >
        <div className="p-4 bg-blue-100 rounded-full">
          <ShoppingBag className="w-8 h-8 text-blue-600" />
        </div>
      </motion.div>

      <h3 className="text-2xl font-bold text-gray-900 mb-2">No Claims Yet</h3>
      <p className="text-gray-600 mb-6 max-w-sm mx-auto">
        You haven't claimed any deals yet. Explore our amazing startup benefits and claim
        your first deal today!
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/deals">
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center space-x-2">
            <span>Explore Deals</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      <div className="mt-8 pt-8 border-t border-gray-200">
        <p className="text-sm text-gray-600 mb-4">Popular categories:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {[
            'Developer Tools',
            'Cloud Services',
            'Design',
            'Productivity',
            'Security',
          ].map((category) => (
            <motion.div
              key={category}
              whileHover={{ scale: 1.05 }}
              className="px-3 py-1 bg-gray-100 hover:bg-blue-50 rounded-full text-sm text-gray-700 cursor-pointer transition-colors"
            >
              {category}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
