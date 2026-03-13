'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { toast } from 'react-hot-toast';
import { 
  User, 
  Mail, 
  Lock, 
  Calendar, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  Shield,
  Zap,
  Globe
} from 'lucide-react';

const signupSchema = z
  .object({
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(20, 'Username must be less than 20 characters')
      .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    email: z.string().email('Invalid email address'),
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
    dateOfBirth: z.string().refine((date) => {
      const age = new Date().getFullYear() - new Date(date).getFullYear();
      return age >= 13;
    }, 'You must be at least 13 years old'),
    terms: z.boolean().refine((val) => val === true, 'You must accept the terms'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SignupForm = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const password = watch('password', '');

  const onSubmit = async (data: SignupForm) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          fullName: data.fullName,
          password: data.password,
        }),
      });

      if (response.ok) {
        toast.success('Account created successfully!');
        router.push('/login');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to create account');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = () => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const lengthValid = password.length >= 8;

    const strength = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar, lengthValid].filter(Boolean).length;
    
    if (strength <= 2) return { text: 'Weak', color: 'bg-red-500', width: 33 };
    if (strength <= 4) return { text: 'Medium', color: 'bg-yellow-500', width: 66 };
    return { text: 'Strong', color: 'bg-green-500', width: 100 };
  };

  const stepVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
    setStep(step + newDirection);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 text-white/10">
        <Sparkles className="w-16 h-16 animate-spin-slow" />
      </div>
      <div className="absolute bottom-20 right-20 text-white/10">
        <Shield className="w-20 h-20 animate-bounce-slow" />
      </div>
      <div className="absolute top-40 right-40 text-white/10">
        <Zap className="w-12 h-12 animate-pulse-slow" />
      </div>
      <div className="absolute bottom-40 left-40 text-white/10">
        <Globe className="w-24 h-24 animate-float" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full relative z-10 px-4"
      >
        {/* Logo/Brand */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 shadow-2xl mb-4">
            <span className="text-3xl font-bold text-white">S</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">SocialFlow</h1>
          <p className="text-white/80">Join the community</p>
        </motion.div>

        <Card className="p-8 backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
          <div className="text-center mb-8">
            <motion.h2 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-white mb-2"
            >
              Create Account
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white/70"
            >
              Start your journey with us
            </motion.p>
          </div>

          {/* Modern Progress Steps */}
          <div className="relative mb-10">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/20 -translate-y-1/2"></div>
            <div className="relative flex justify-between">
              {[1, 2, 3].map((s) => (
                <motion.div
                  key={s}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 + s * 0.1 }}
                  className={`relative z-10 flex flex-col items-center`}
                >
                  <motion.div
                    animate={{
                      scale: step === s ? 1.2 : 1,
                      backgroundColor: step >= s ? '#8b5cf6' : 'rgba(255,255,255,0.2)'
                    }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm border-2 ${
                      step >= s ? 'border-purple-400' : 'border-white/20'
                    }`}
                  >
                    {s < step ? (
                      <CheckCircle className="h-6 w-6 text-white" />
                    ) : (
                      <span className="text-white font-semibold">{s}</span>
                    )}
                  </motion.div>
                  <span className="absolute -bottom-6 text-xs text-white/60 whitespace-nowrap">
                    {s === 1 ? 'Basic Info' : s === 2 ? 'Security' : 'Details'}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className="space-y-4"
              >
                {step === 1 && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Username
                      </label>
                      <div className="relative group">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40 group-focus-within:text-purple-400 transition-colors" />
                        <Input
                          {...register('username')}
                          className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-purple-400 focus:ring-purple-400/20 transition-all"
                          placeholder="johndoe"
                          error={errors.username?.message}
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Email Address
                      </label>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40 group-focus-within:text-purple-400 transition-colors" />
                        <Input
                          {...register('email')}
                          type="email"
                          className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-purple-400 focus:ring-purple-400/20 transition-all"
                          placeholder="you@example.com"
                          error={errors.email?.message}
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Full Name
                      </label>
                      <Input
                        {...register('fullName')}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-purple-400 focus:ring-purple-400/20 transition-all"
                        placeholder="John Doe"
                        error={errors.fullName?.message}
                      />
                    </motion.div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Password
                      </label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40 group-focus-within:text-purple-400 transition-colors" />
                        <Input
                          {...register('password')}
                          type="password"
                          className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-purple-400 focus:ring-purple-400/20 transition-all"
                          placeholder="••••••••"
                          error={errors.password?.message}
                        />
                      </div>
                      {password && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-white/60">Password strength:</span>
                            <span className={`text-xs font-medium ${
                              passwordStrength().text === 'Weak' ? 'text-red-400' :
                              passwordStrength().text === 'Medium' ? 'text-yellow-400' :
                              'text-green-400'
                            }`}>
                              {passwordStrength().text}
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${passwordStrength().width}%` }}
                              transition={{ duration: 0.3 }}
                              className={`h-full rounded-full ${passwordStrength().color}`}
                            />
                          </div>
                        </motion.div>
                      )}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Confirm Password
                      </label>
                      <Input
                        {...register('confirmPassword')}
                        type="password"
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-purple-400 focus:ring-purple-400/20 transition-all"
                        placeholder="••••••••"
                        error={errors.confirmPassword?.message}
                      />
                    </motion.div>
                  </>
                )}

                {step === 3 && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Date of Birth
                      </label>
                      <div className="relative group">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40 group-focus-within:text-purple-400 transition-colors" />
                        <Input
                          {...register('dateOfBirth')}
                          type="date"
                          className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-purple-400 focus:ring-purple-400/20 transition-all [color-scheme:dark]"
                          max={new Date().toISOString().split('T')[0]}
                          error={errors.dateOfBirth?.message}
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="flex items-center space-x-3 p-4 rounded-lg bg-white/5 border border-white/10"
                    >
                      <input
                        {...register('terms')}
                        type="checkbox"
                        id="terms"
                        className="w-4 h-4 rounded border-white/20 bg-white/5 text-purple-600 focus:ring-purple-500/20 focus:ring-offset-0"
                      />
                      <label htmlFor="terms" className="text-sm text-white/80">
                        I agree to the{' '}
                        <Link href="/terms" className="text-purple-400 hover:text-purple-300 underline decoration-purple-400/30">
                          Terms of Service
                        </Link>
                        {' '}and{' '}
                        <Link href="/privacy" className="text-purple-400 hover:text-purple-300 underline decoration-purple-400/30">
                          Privacy Policy
                        </Link>
                      </label>
                    </motion.div>
                    {errors.terms && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm text-red-400"
                      >
                        {errors.terms.message}
                      </motion.p>
                    )}
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex gap-3 pt-4">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => paginate(-1)}
                  className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              )}
              
              {step < 3 ? (
                <Button
                  type="button"
                  onClick={() => paginate(1)}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg shadow-purple-500/25"
                >
                  Next Step
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg shadow-purple-500/25"
                  isLoading={isLoading}
                >
                  Create Account
                </Button>
              )}
            </div>
          </form>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 text-center text-sm text-white/60"
          >
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium text-purple-400 hover:text-purple-300 transition-colors"
            >
              Sign in
            </Link>
          </motion.p>
        </Card>
      </motion.div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(10deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}