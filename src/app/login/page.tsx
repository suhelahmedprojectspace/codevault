'use client';
import { Card, CardContent } from '@/components/ui/card';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';
import { Eye, EyeClosed, Loader2 } from 'lucide-react';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    if (error === 'UserNotFound') {
      toast.error('Account not found. Redirecting to signup...');
      setTimeout(() => {
        router.push('/signup');
      }, 2000);
    } else if (error === 'INCORRECT_PASSWORD') {
      toast.error('Invalid email or password');
    }
  }, [error, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: true,
        callbackUrl: '/dashboard',
      });
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg rounded-xl overflow-hidden">
        <CardContent className="p-0">
          <div className="bg-primary p-6 text-center">
            <h1 className="text-2xl font-bold text-white">Welcome to CodeVault</h1>
            <p className="text-primary-foreground/90 mt-1">
              Secure access to your development resources
            </p>
          </div>

          <form className="p-6 md:p-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="username@example.com"
                  required
                  className="focus-visible:ring-primary"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Link
                    href={{
                      pathname: '/forgotpassword',
                      query: { email: formData.email },
                    }}
                    className="text-xs text-primary hover:underline underline-offset-2"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    required
                    className="focus-visible:ring-primary pr-10"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeClosed size={18} className="stroke-current" />
                    ) : (
                      <Eye size={18} className="stroke-current" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full py-5 font-medium" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                'Login'
              )}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Button
              variant="outline"
              type="button"
              className="w-full gap-2"
              onClick={() => signIn('google')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              Google
            </Button>

            <div className="text-center text-sm text-muted-foreground mt-4">
              Don't have an account?{' '}
              <Link
                href="/signup"
                className="font-medium text-primary hover:underline underline-offset-2"
              >
                Create one
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
