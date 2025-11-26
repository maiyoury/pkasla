"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { ROUTES } from "@/constants";
import type { LoginDto, User } from "@/types";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Mail, Lock, EyeOff, Eye, Loader2 } from "lucide-react";
import { Github, Linkedin } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { update: updateSession } = useSession();

  // Initialize form data with remembered email if available
  const getInitialFormData = (): LoginDto & { rememberMe: boolean } => {
    if (typeof window !== "undefined") {
      const rememberedEmail = localStorage.getItem("rememberedEmail");
      if (rememberedEmail) {
        return {
          email: rememberedEmail,
          password: "",
          rememberMe: true,
        };
      }
    }
    return {
      email: "",
      password: "",
      rememberMe: false,
    };
  };

  const [formData, setFormData] = useState<LoginDto & { rememberMe: boolean }>(
    getInitialFormData
  );
  const [isLoading, setIsLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Handle OAuth callback success
  useEffect(() => {
    const oauthSuccess = searchParams.get("oauth_success");
    const provider = searchParams.get("provider");

    if (oauthSuccess === "true" && provider) {
      toast.success(`Successfully signed in with ${provider}!`);
      // Clean up URL
      router.replace("/login");
    }
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Trim email
    const trimmedEmail = formData.email.trim();

    // Validate form
    const isEmailValid = validateEmail(trimmedEmail);
    const isPasswordValid = validatePassword(formData.password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    setIsLoading(true);

    try {
      const callbackUrl = searchParams.get("callbackUrl") || "/";
      const result = await signIn("credentials", {
        email: trimmedEmail,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(
          result.error === "CredentialsSignin"
            ? "Invalid email or password"
            : result.error
        );
        setIsLoading(false);
        return;
      }

      if (result?.ok) {
        // Handle remember me
        if (formData.rememberMe) {
          localStorage.setItem("rememberedEmail", trimmedEmail);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        toast.success("Login successful!");

        // Update session to get latest user data
        await updateSession();

        // Get user role for redirect
        try {
          const sessionResponse = await fetch("/api/auth/session");
          const sessionData = await sessionResponse.json();
          const user = sessionData?.user as User | undefined;

          // Determine redirect path
          let redirectPath = callbackUrl;
          
          // If callbackUrl is home or root, redirect based on role
          if (callbackUrl === "/" || callbackUrl === ROUTES.HOME) {
            redirectPath = user?.role === "admin" ? ROUTES.ADMIN : ROUTES.DASHBOARD;
          }

          router.push(redirectPath);
          router.refresh();
        } catch {
          // Fallback: redirect to home, middleware will handle role-based redirect
          router.push(callbackUrl);
          router.refresh();
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
      setIsLoading(false);
    }
  };

  const validateEmail = useCallback((email: string): boolean => {
    if (!email.trim()) {
      setEmailError("Email is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  }, []);

  const validatePassword = useCallback((password: string): boolean => {
    if (!password) {
      setPasswordError("Password is required");
      return false;
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }
    setPasswordError("");
    return true;
  }, []);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, email: value });
    if (emailError) {
      validateEmail(value);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, password: value });
    if (passwordError) {
      validatePassword(value);
    }
  };

  const handleOAuthSignIn = useCallback(
    (provider: "google" | "github" | "linkedin") => {
      setOauthLoading(provider);
      const callbackUrl = searchParams.get("callbackUrl") || "/";
      signIn(provider, {
        callbackUrl: callbackUrl,
        redirect: true,
      });
    },
    [searchParams]
  );

  return (
    <div className="bg-[url('/images/login-background.png')] bg-cover border-0 bg-center">
      <Card className="p-16 shadow-none bg-transparent  bg-cover border-0 bg-center">
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email Field */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  ref={emailInputRef}
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleEmailChange}
                  onBlur={() => validateEmail(formData.email)}
                  placeholder="email@example.com"
                  className={cn(
                    "h-11 text-sm border-gray-300 pl-10 pr-4 focus:border-black focus:ring-1 focus:ring-black transition-all",
                    emailError &&
                      "border-red-400 focus:border-red-400 focus:ring-red-400"
                  )}
                  required
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? "email-error" : undefined}
                />
              </div>
              {emailError && (
                <p id="email-error" className="text-xs text-red-600 mt-1">
                  {emailError}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </Label>
                <Link
                  href={ROUTES.FORGOT_PASSWORD}
                  className="text-xs text-gray-600 hover:text-black hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handlePasswordChange}
                  onBlur={() => validatePassword(formData.password)}
                  placeholder="Enter your password"
                  className={cn(
                    "h-11 text-sm border-gray-300 pl-10 pr-11 focus:border-black focus:ring-1 focus:ring-black transition-all",
                    passwordError &&
                      "border-red-400 focus:border-red-400 focus:ring-red-400"
                  )}
                  required
                  aria-invalid={!!passwordError}
                  aria-describedby={
                    passwordError ? "password-error" : undefined
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700 focus:outline-none transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {passwordError && (
                <p id="password-error" className="text-xs text-red-600 mt-1">
                  {passwordError}
                </p>
              )}
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberMe"
                checked={formData.rememberMe}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, rememberMe: checked === true })
                }
              />
              <Label
                htmlFor="rememberMe"
                className="text-sm font-normal text-gray-700 cursor-pointer"
              >
                Remember me
              </Label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 text-sm font-medium bg-black hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

        
        </CardContent>
      </Card>


          {/* OAuth Buttons */}
          <div className="grid grid-cols-3 gap-3">
            {/* Google */}
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOAuthSignIn("google")}
              disabled={!!oauthLoading || isLoading}
              className="h-11 border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {oauthLoading === "google" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
            </Button>

            {/* GitHub */}
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOAuthSignIn("github")}
              disabled={!!oauthLoading || isLoading}
              className="h-11 border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {oauthLoading === "github" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Github className="h-5 w-5" />
              )}
            </Button>

            {/* LinkedIn */}
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOAuthSignIn("linkedin")}
              disabled={!!oauthLoading || isLoading}
              className="h-11 border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {oauthLoading === "linkedin" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Linkedin className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <span className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
            </span>
            <Link
              href="/register"
              className="text-sm text-black hover:underline font-semibold transition-colors"
            >
              Create account
            </Link>
          </div>
    </div>
  );
}
