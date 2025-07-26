'use client';
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';
import { Eye, EyeClosed, Loader2 } from 'lucide-react';

const SignUpPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  });

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      toast.error(
        'Password must contain at least 8 characters, including uppercase, lowercase, and a number',
      );
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post('/signup', {
        email: formData.email,
        username: formData.username,
        password: formData.password,
      });

      if (res.status === 201) {
        const result = await signIn('credentials', {
          redirect: false,
          email: formData.email,
          password: formData.password,
          callbackUrl: '/dashboard',
        });

        if (result?.ok) {
          toast.success('Account created successfully! Redirecting...');
          router.push('/dashboard');
        } else {
          toast.error('Login failed. Please try again.');
        }
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl rounded-lg overflow-hidden border-0">
        <div className="bg-primary p-6 text-center">
          <CardHeader className="space-y-1 p-0">
            <CardTitle className="text-2xl font-bold text-white">Join CodeVault</CardTitle>
            <CardDescription className="text-primary-foreground/90">
              Create your account to unlock powerful features
            </CardDescription>
          </CardHeader>
        </div>

        <CardContent className="p-6 md:p-8">
          <form className="space-y-6" onSubmit={handleSignup}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="focus-visible:ring-primary"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  className="focus-visible:ring-primary"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    className="focus-visible:ring-primary pr-10"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
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
                <p className="text-xs text-muted-foreground">
                  Minimum 8 characters with uppercase, lowercase, and a number
                </p>
              </div>
            </div>

            <Button type="submit" className="w-full py-5 font-medium" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Sign Up'
              )}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or sign up with</span>
              </div>
            </div>

            <Button
              variant="outline"
              type="button"
              className="w-full gap-2"
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              Continue with Google
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link
              href="/login"
              className="font-medium text-primary hover:underline underline-offset-2"
            >
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpPage;
