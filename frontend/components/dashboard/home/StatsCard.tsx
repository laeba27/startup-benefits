'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color: string;
  iconColor: string;
}

export function StatsCard({
  icon: Icon,
  label,
  value,
  color,
  iconColor,
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={`${color} rounded-xl p-6 border border-gray-200 shadow-sm transition-shadow hover:shadow-md`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <motion.div
          whileHover={{ scale: 1.1, rotate: 10 }}
          className={`${iconColor} p-3 rounded-lg bg-white/50`}
        >
          <Icon className="w-6 h-6" />
        </motion.div>
      </div>
    </motion.div>
  );
}
