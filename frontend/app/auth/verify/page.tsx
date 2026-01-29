'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/Toast';

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setError('Invalid verification link');
      return;
    }

    verifyToken(token);
  }, [searchParams]);

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Extract tokens and user data from new response format
        const { accessToken, refreshToken, expiresIn } = data.data.tokens;
        const user = data.data.user;
        
        // Use the updated login method with token pair
        login(accessToken, refreshToken, user);
        
        setStatus('success');
        
        toast({
          title: 'Welcome to Startup Benefits! 🎉',
          description: 'You\'re now signed in and ready to explore deals.',
          type: 'success',
        });

        // Redirect to dashboard after a brief delay
        setTimeout(() => {
          router.push('/deals');
        }, 2000);
      } else {
        throw new Error(data.error || 'Verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setStatus('error');
      setError(error instanceof Error ? error.message : 'Verification failed');
      
      toast({
        title: 'Verification failed',
        description: 'Your login link may have expired. Please try signing in again.',
        type: 'error',
      });
    }
  };

  const getStatusContent = () => {
    switch (status) {
      case 'loading':
        return {
          icon: <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />,
          title: 'Verifying your account...',
          description: 'Please wait while we authenticate your account.',
          bgColor: 'bg-blue-50',
          showButton: false,
        };
      
      case 'success':
        return {
          icon: <CheckCircle className="h-16 w-16 text-green-600" />,
          title: 'Authentication successful!',
          description: 'You\'re now signed in. Redirecting you to explore deals...',
          bgColor: 'bg-green-50',
          showButton: false,
        };
      
      case 'error':
        return {
          icon: <XCircle className="h-16 w-16 text-red-600" />,
          title: 'Verification failed',
          description: error || 'Your login link may have expired or is invalid.',
          bgColor: 'bg-red-50',
          showButton: true,
        };
      
      default:
        return null;
    }
  };

  const content = getStatusContent();
  if (!content) return null;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 to-purple-50">
      <motion.div
        className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className={`w-20 h-20 ${content.bgColor} rounded-full flex items-center justify-center mx-auto mb-6`}>
          {content.icon}
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          {content.title}
        </h1>
        
        <p className="text-gray-600 mb-6">
          {content.description}
        </p>

        {content.showButton && (
          <div className="space-y-3">
            <Button 
              onClick={() => router.push('/login')}
              className="w-full group"
            >
              Try signing in again
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              onClick={() => router.push('/')}
              variant="outline"
              className="w-full"
            >
              Back to homepage
            </Button>
          </div>
        )}

        {status === 'success' && (
          <div className="mt-4 text-xs text-gray-500">
            Redirecting in a few seconds...
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}