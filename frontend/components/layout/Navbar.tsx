'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap, User, LogOut, Home, ShoppingBag, LayoutDashboard, LogIn, UserPlus, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const pathname = usePathname();

  // Navigation items with icons and paths
  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Deals', href: '/deals', icon: ShoppingBag },
    ...(isAuthenticated ? [{ name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard }] : []),
  ];

  // Get page breadcrumb information
  const getBreadcrumb = () => {
    if (pathname === '/') return { name: 'Home', icon: Home };
    if (pathname === '/deals') return { name: 'Deals', icon: ShoppingBag };
    if (pathname === '/dashboard') return { name: 'Dashboard', icon: LayoutDashboard };
    if (pathname === '/register') return { name: 'Register', icon: UserPlus };
    if (pathname === '/login') return { name: 'Sign In', icon: LogIn };
    return { name: 'Page', icon: Home };
  };

  const currentPage = getBreadcrumb();
  const CurrentIcon = currentPage.icon;

  // Generate avatar from user initials
  const getAvatar = () => {
    if (user?.profile?.name) {
      const nameParts = user.profile.name.trim().split(/\s+/).filter((n: string) => n.length > 0);
      if (nameParts.length >= 2) {
        return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
      }
      return nameParts[0]?.slice(0, 2).toUpperCase() || 'U';
    }
    return 'U';
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <motion.div
                whileHover={{ rotate: 10 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <Zap className="h-8 w-8 text-blue-600" />
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Startup Benefits
              </span>
            </Link>

            {/* Desktop Navigation - Center */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const ItemIcon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
                        isActive
                          ? 'bg-blue-100 text-blue-600'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <ItemIcon className="h-4 w-4" />
                      <span className="font-medium">{item.name}</span>
                      {isActive && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute inset-0 bg-blue-100 rounded-lg -z-10"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </motion.div>
                  </Link>
                );
              })}
            </div>

            {/* Right Section - User & Auth */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  {/* User Info */}
                  <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">{user?.profile?.name || user?.email || 'User'}</span>
                  </div>

                  {/* Avatar Dropdown */}
                  <div className="relative">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-shadow"
                      title={user?.profile?.name || user?.email || 'User'}
                    >
                      {getAvatar()}
                    </motion.button>

                    {/* Profile Dropdown Menu */}
                    <AnimatePresence>
                      {isProfileOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden"
                        >
                          <div className="p-4 border-b border-gray-100">
                            <p className="font-semibold text-gray-900">{user?.profile?.name || 'User'}</p>
                            <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                          </div>

                          <div className="p-2 space-y-2">
                            <Link href="/dashboard" onClick={() => setIsProfileOpen(false)}>
                              <motion.button
                                whileHover={{ x: 4 }}
                                className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <LayoutDashboard className="h-4 w-4 text-blue-600" />
                                <span className="text-sm font-medium">Dashboard</span>
                              </motion.button>
                            </Link>

                            <Link href="/profile" onClick={() => setIsProfileOpen(false)}>
                              <motion.button
                                whileHover={{ x: 4 }}
                                className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                <User className="h-4 w-4 text-gray-600" />
                                <span className="text-sm font-medium">Profile</span>
                              </motion.button>
                            </Link>

                            <button
                              onClick={() => {
                                logout();
                                setIsProfileOpen(false);
                              }}
                              className="w-full flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border-t border-gray-100 mt-2 pt-3"
                            >
                              <LogOut className="h-4 w-4" />
                              <span className="text-sm font-medium">Logout</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link href="/login">
                    <Button variant="ghost" size="sm" className="font-medium">
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-medium">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-3">
              {isAuthenticated && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xs shadow-lg"
                >
                  {getAvatar()}
                </motion.button>
              )}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Page State Indicator */}
        {/* <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-gray-50 to-transparent border-b border-gray-200/50 px-4 sm:px-6 lg:px-8 py-2"
        >
          <div className="max-w-7xl mx-auto flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700 transition-colors">
              <Home className="h-4 w-4" />
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <div className="flex items-center space-x-2">
              <CurrentIcon className="h-4 w-4 text-blue-600" />
              <span className="font-semibold text-gray-900">{currentPage.name}</span>
            </div>
          </div>
        </motion.div> */}
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden bg-white border-t border-gray-200"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 py-4 space-y-2">
              {/* Mobile Nav Items */}
              {navItems.map((item) => {
                const ItemIcon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                  >
                    <motion.div
                      whileHover={{ x: 4 }}
                      className={`px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors ${
                        isActive
                          ? 'bg-blue-100 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <ItemIcon className="h-5 w-5" />
                      <span className="font-medium">{item.name}</span>
                    </motion.div>
                  </Link>
                );
              })}

              <div className="py-2 border-t border-gray-200 my-2">
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-3 flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                        {getAvatar()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{user?.profile?.name || 'User'}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                    </div>

                    <Link href="/profile" onClick={() => setIsOpen(false)}>
                      <motion.button
                        whileHover={{ x: 4 }}
                        className="w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center space-x-3 transition-colors"
                      >
                        <User className="h-4 w-4" />
                        <span className="text-sm font-medium">Profile</span>
                      </motion.button>
                    </Link>

                    <button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center space-x-3 transition-colors mt-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="text-sm font-medium">Logout</span>
                    </button>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full justify-start">
                        <LogIn className="h-4 w-4 mr-2" />
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setIsOpen(false)}>
                      <Button size="sm" className="w-full justify-start bg-gradient-to-r from-blue-600 to-purple-600">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Get Started
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Profile Dropdown */}
      <AnimatePresence>
        {isProfileOpen && isAuthenticated && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsProfileOpen(false)}
            className="md:hidden fixed inset-0 bg-black/20 z-40"
          />
        )}
      </AnimatePresence>
    </>
  );
}