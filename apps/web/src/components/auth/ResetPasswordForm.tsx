'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { ROUTES } from '@/constants';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    passwordInputRef.current?.focus();
    
    // Check if token exists in URL
    const token = searchParams.get('token');
    if (!token) {
      toast.error('តំណភ្ជាប់មិនត្រឹមត្រូវ។ សូមស្នើសុំកំណត់ពាក្យសម្ងាត់ឡើងវិញម្តងទៀត។');
    }
  }, [searchParams]);

  const validatePassword = useCallback((value: string): boolean => {
    if (!value) {
      toast.error('សូមបញ្ចូលពាក្យសម្ងាត់របស់អ្នក');
      return false;
    }
    if (value.length < 6) {
      toast.error('ពាក្យសម្ងាត់ត្រូវមានយ៉ាងហោចណាស់ 6 តួអក្សរ');
      return false;
    }
    return true;
  }, []);

  const validateConfirmPassword = useCallback((value: string, password: string): boolean => {
    if (!value) {
      toast.error('សូមបញ្ចូលការបញ្ជាក់ពាក្យសម្ងាត់');
      return false;
    }
    if (value !== password) {
      toast.error('ពាក្យសម្ងាត់មិនត្រូវគ្នា');
      return false;
    }
    return true;
  }, []);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, password: value });
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, confirmPassword: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = searchParams.get('token');
    if (!token) {
      toast.error('តំណភ្ជាប់មិនត្រឹមត្រូវ។ សូមស្នើសុំកំណត់ពាក្យសម្ងាត់ឡើងវិញម្តងទៀត។');
      return;
    }

    // Validate form - stop at first error to avoid duplicate toasts
    const isPasswordValid = validatePassword(formData.password);
    if (!isPasswordValid) {
      return;
    }

    const isConfirmPasswordValid = validateConfirmPassword(formData.confirmPassword, formData.password);
    if (!isConfirmPasswordValid) {
      return;
    }

    setLoading(true);

    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/reset-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     token,
      //     password: formData.password,
      //   })
      // })
      // const result = await response.json()

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      setIsSuccess(true);
      toast.success('កំណត់ពាក្យសម្ងាត់ឡើងវិញជោគជ័យ!');

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push(ROUTES.LOGIN);
      }, 2000);
    } catch (err) {
      console.error('Reset password error:', err);
      toast.error('មានកំហុសកើតឡើង។ សូមព្យាយាមម្តងទៀត។');
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-[320px] sm:max-w-[380px] md:max-w-[420px] lg:max-w-[450px] mx-auto">
        <Card className="p-0 shadow-none bg-transparent border-0">
          <CardContent className="relative p-0 m-0 sm:p-4 md:p-10 lg:p-12">
            {/* Header Frame */}
            <div 
              className="absolute -top-12 flex items-center justify-center left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] h-44 md:h-64 bg-[url('/images/assets/frame-image-title.png')] bg-no-repeat bg-cover bg-center z-10"
              style={{
                backgroundSize: '100% 100%',
              }}
            >
              <h1 className="text-red-800 md:text-3xl text-2xl -translate-y-1 font-moulpali font-bold">កំណត់ពាក្យសម្ងាត់</h1>
            </div>
            <div className="pt-8 sm:pt-10 md:pt-12 space-y-4 sm:space-y-5 text-center">
              <div className="space-y-3">
                <p className="text-sm sm:text-base text-gray-700">
                  ពាក្យសម្ងាត់របស់អ្នកត្រូវបានកំណត់ឡើងវិញដោយជោគជ័យ!
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                  អ្នកនឹងត្រូវបានបញ្ជូនទៅកាន់ទំព័រចូល...
                </p>
              </div>
              <Link
                href={ROUTES.LOGIN}
                className="inline-block text-sm text-black hover:underline font-semibold transition-colors"
              >
                ចូលឥឡូវនេះ
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[320px] sm:max-w-[380px] md:max-w-[420px] lg:max-w-[450px] mx-auto">
      <Card className="p-0 shadow-none bg-transparent border-0">
        <CardContent className="relative p-0 m-0 sm:p-4 md:p-10 lg:p-12">
          {/* Header Frame */}
          <div 
            className="absolute -top-12 flex items-center justify-center left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] h-44 md:h-64 bg-[url('/images/assets/frame-image-title.png')] bg-no-repeat bg-cover bg-center z-10"
            style={{
              backgroundSize: '100% 100%',
            }}
          >
            <h1 className="text-red-800 md:text-3xl text-2xl -translate-y-1 font-moulpali font-bold">កំណត់ពាក្យសម្ងាត់</h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 pt-8 sm:pt-10 md:pt-12" noValidate autoComplete="on">
            {/* Password Field */}
            <div className="space-y-2">
              <div className="relative">
                <div 
                  className="relative bg-[url('/images/assets/input-frame.png')] bg-no-repeat bg-cover bg-center h-10 sm:h-11 rounded-md"
                  style={{
                    backgroundSize: '100% 100%',
                  }}
                >
                  <input
                    ref={passwordInputRef}
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handlePasswordChange}
                    placeholder="ពាក្យសម្ងាត់ថ្មី"
                    autoComplete="new-password"
                    className="w-full h-full bg-transparent ring-0 border-0 outline-none text-sm pl-10 sm:pl-12 pr-11 text-white placeholder:text-gray-400 focus:ring-0 focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 sm:right-6 cursor-pointer top-1/2 transform -translate-y-1/2 text-white hover:text-gray-700 focus:outline-none transition-colors z-10"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-white" />
                    ) : (
                      <Eye className="h-4 w-4 text-white" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <div className="relative">
                <div 
                  className="relative bg-[url('/images/assets/input-frame.png')] bg-no-repeat bg-cover bg-center h-10 sm:h-11 rounded-md"
                  style={{
                    backgroundSize: '100% 100%',
                  }}
                >
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    placeholder="បញ្ជាក់ពាក្យសម្ងាត់ថ្មី"
                    autoComplete="new-password"
                    className="w-full h-full bg-transparent ring-0 border-0 outline-none text-sm pl-10 sm:pl-12 pr-11 text-white placeholder:text-gray-400 focus:ring-0 focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-5 sm:right-6 cursor-pointer top-1/2 transform -translate-y-1/2 text-white hover:text-gray-700 focus:outline-none transition-colors z-10"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-white" />
                    ) : (
                      <Eye className="h-4 w-4 text-white" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 sm:h-11 text-sm font-medium hover:bg-transparent cursor-pointer shadow-none bg-transparent bg-[url('/images/assets/input-frame.png')] bg-no-repeat bg-cover bg-center disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              style={{
                backgroundSize: '100% 100%',
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  កំពុងកំណត់...
                </>
              ) : (
                'កំណត់ពាក្យសម្ងាត់'
              )}
            </Button>
          </form>

          {/* Back to Login Link */}
          <div className="mt-3 sm:mt-4 md:mt-6 text-center">
            <Link
              href={ROUTES.LOGIN}
              className="text-xs sm:text-sm text-black hover:underline font-semibold transition-colors"
            >
              ← ត្រលប់ទៅកាន់ទំព័រចូល
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

