import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/axios-client';
import toast from 'react-hot-toast';

export interface BakongPaymentResponse {
  qrCode: string;
  transactionId: string;
  amount: number;
  currency: string;
  expiresAt?: string;
}

export interface StripePaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
}

/**
 * Create Bakong payment for subscription
 */
export function useCreateBakongSubscriptionPayment() {
  return useMutation<BakongPaymentResponse, Error, { planId: string }>({
    mutationFn: async ({ planId }) => {
      const response = await api.post<BakongPaymentResponse>('/payments/bakong/subscription', { planId });
      if (!response.success) {
        throw new Error(response.error || 'Failed to create Bakong payment');
      }
      if (!response.data) {
        throw new Error('Payment data not found');
      }
      return response.data;
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Failed to create Bakong payment');
    },
  });
}

/**
 * Create Stripe payment intent for subscription
 */
export function useCreateStripeSubscriptionPayment() {
  return useMutation<StripePaymentIntentResponse, Error, { planId: string }>({
    mutationFn: async ({ planId }) => {
      const response = await api.post<StripePaymentIntentResponse>('/payments/subscription/intent', { planId });
      if (!response.success) {
        throw new Error(response.error || 'Failed to create Stripe payment');
      }
      if (!response.data) {
        throw new Error('Payment data not found');
      }
      return response.data;
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Failed to create Stripe payment');
    },
  });
}

