'use client';

import React from "react"

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mail, ArrowRight, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from '@/components/ui/Toast';

interface RegistrationData {
  email: string;
  name: string;
  phone: string;
  company: string;
  role: string;
}

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegistrationData>({
    email: '',
    name: '',
    phone: '',
    company: '',
    role: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.name || isLoading) return;

    setIsLoading(true);

    try {
      // Register user with complete profile data
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setEmailSent(true);
        toast({
          title: 'Registration successful!',
          description: 'Check your email for the verification link.',
          type: 'success',
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: error instanceof Error ? error.message : 'Please try again.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Success Card */}
          <div className="bg-card rounded-2xl shadow-lg overflow-hidden border border-border">
            {/* Success Icon Animation */}
            <div className="flex justify-center pt-12 pb-6">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
                className="relative w-24 h-24 bg-green-500 rounded-full flex items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                >
                  <Check className="w-12 h-12 text-white" strokeWidth={3} />
                </motion.div>
              </motion.div>
            </div>

            {/* Content */}
            <div className="px-8 pb-12 text-center">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-foreground mb-3"
              >
                Welcome, {formData.name}!
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-muted-foreground mb-6 leading-relaxed"
              >
                Your account has been created successfully. We've sent a verification link to{' '}
                <span className="font-semibold text-foreground">{formData.email}</span>
              </motion.p>

              {/* Account Summary */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-muted rounded-lg p-4 mb-6 space-y-2 text-sm text-left"
              >
                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <span className="text-muted-foreground">Name</span>
                  <span className="font-medium text-foreground">{formData.name}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium text-foreground truncate ml-2">{formData.email}</span>
                </div>
                {formData.company && (
                  <div className="flex justify-between items-center pb-2 border-b border-border">
                    <span className="text-muted-foreground">Company</span>
                    <span className="font-medium text-foreground">{formData.company}</span>
                  </div>
                )}
                {formData.role && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Role</span>
                    <span className="font-medium text-foreground">{formData.role}</span>
                  </div>
                )}
              </motion.div>

              {/* Info Box */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8 text-sm"
              >
                <p className="text-blue-900 dark:text-blue-100">
                  <span className="font-semibold">Next step:</span> Check your email and click the verification link to activate your account.
                </p>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="space-y-3"
              >
                <Link href="/" className="block">
                  <Button className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90">
                    Return to Home
                  </Button>
                </Link>
                <Button
                  onClick={() => setEmailSent(false)}
                  variant="outline"
                  className="w-full h-12"
                >
                  Create Another Account
                </Button>
              </motion.div>

              {/* Helper Text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-xs text-muted-foreground mt-6"
              >
                Didn't receive the email? Check your spam folder or contact support.
              </motion.p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        {/* Registration Card */}
        <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden">
          {/* Header */}
          <div className="bg-primary text-primary-foreground px-8 py-12 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl font-bold mb-2"
            >
              Get Started
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-primary-foreground/80 text-sm"
            >
              Join thousands of teams building amazing products
            </motion.p>
          </div>

          {/* Form Content */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  Full Name <span className="text-destructive">*</span>
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Jane Smith"
                  required
                  disabled={isLoading}
                  className="h-11 rounded-lg"
                />
              </motion.div>

              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email Address <span className="text-destructive">*</span>
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="jane@company.com"
                  required
                  disabled={isLoading}
                  className="h-11 rounded-lg"
                />
              </motion.div>

              {/* Company Field */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label htmlFor="company" className="block text-sm font-medium text-foreground mb-2">
                  Company Name
                </label>
                <Input
                  id="company"
                  name="company"
                  type="text"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Acme Inc."
                  disabled={isLoading}
                  className="h-11 rounded-lg"
                />
              </motion.div>

              {/* Role Field */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
              >
                <label htmlFor="role" className="block text-sm font-medium text-foreground mb-2">
                  Role
                </label>
                <Input
                  id="role"
                  name="role"
                  type="text"
                  value={formData.role}
                  onChange={handleInputChange}
                  placeholder="Product Manager"
                  disabled={isLoading}
                  className="h-11 rounded-lg"
                />
              </motion.div>

              {/* Phone Field */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                  Phone Number <span className="text-muted-foreground text-xs">(optional)</span>
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 000-0000"
                  disabled={isLoading}
                  className="h-11 rounded-lg"
                />
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                className="pt-2"
              >
                <Button
                  type="submit"
                  className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-lg transition-all duration-200 group"
                  disabled={isLoading || !formData.email || !formData.name}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </motion.div>

              {/* Login Link */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center pt-4"
              >
                <p className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Link href="/login" className="font-semibold text-primary hover:text-primary/90 transition-colors">
                    Sign in
                  </Link>
                </p>
              </motion.div>
            </form>
          </div>
        </div>

        {/* Footer Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-xs text-muted-foreground mt-6"
        >
          By signing up, you agree to our Terms of Service and Privacy Policy
        </motion.p>
      </motion.div>
    </div>
  );
}
