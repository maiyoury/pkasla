import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios-client';
import type { UserSubscription } from '@/types/user-subscription';
import type { TemplatePurchase } from './useTemplatePurchase';
import { useMyTemplatePurchases } from './useTemplatePurchase';
import toast from 'react-hot-toast';

export interface Transaction {
  id: string;
  type: 'subscription' | 'template';
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed' | 'cancelled';
  date: string;
  description: string;
  transactionId?: string;
  paymentMethod?: string;
  subscription?: UserSubscription;
  templatePurchase?: TemplatePurchase;
}

export interface BillingSummary {
  activeSubscription: UserSubscription | null;
  totalSpent: number;
  transactions: Transaction[];
}

export const billingKeys = {
  all: ['billing'] as const,
  summary: () => [...billingKeys.all, 'summary'] as const,
  subscriptions: () => [...billingKeys.all, 'subscriptions'] as const,
  transactions: () => [...billingKeys.all, 'transactions'] as const,
};

/**
 * Get current user's subscriptions
 */
export function useMySubscriptions() {
  return useQuery<UserSubscription[], Error>({
    queryKey: [...billingKeys.subscriptions(), 'me'],
    queryFn: async (): Promise<UserSubscription[]> => {
      const response = await api.get<UserSubscription[]>('/subscriptions/me');
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch subscriptions');
      }
      return response.data || [];
    },
    retry: false,
    staleTime: 1000 * 30, // 30 seconds
  });
}

/**
 * Get current user's active subscription
 */
export function useMyActiveSubscription() {
  return useQuery<UserSubscription | null, Error>({
    queryKey: [...billingKeys.subscriptions(), 'me', 'active'],
    queryFn: async (): Promise<UserSubscription | null> => {
      const response = await api.get<UserSubscription | null>('/subscriptions/me/active');
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch active subscription');
      }
      return response.data || null;
    },
    retry: false,
    staleTime: 1000 * 30, // 30 seconds
  });
}

/**
 * Get billing summary with subscriptions and transactions
 */
export function useBillingSummary(): {
  data: BillingSummary;
  isLoading: boolean;
} {
  const { data: subscriptions = [], isLoading: subscriptionsLoading } = useMySubscriptions();
  const { data: templatePurchases = [], isLoading: purchasesLoading } = useMyTemplatePurchases();

  const transactions: Transaction[] = [
    ...subscriptions.map((sub) => ({
      id: sub.id,
      type: 'subscription' as const,
      amount: typeof sub.planId === 'object' && sub.planId ? sub.planId.price : 0,
      currency: 'USD',
      status: sub.status === 'active' ? 'paid' as const : sub.status === 'cancelled' ? 'cancelled' as const : 'pending' as const,
      date: sub.startDate,
      description: typeof sub.planId === 'object' && sub.planId ? `${sub.planId.displayName} Subscription` : 'Subscription',
      transactionId: sub.transactionId,
      paymentMethod: sub.paymentMethod,
      subscription: sub,
    })),
    ...templatePurchases.map((purchase: TemplatePurchase) => ({
      id: purchase.id,
      type: 'template' as const,
      amount: purchase.price,
      currency: 'USD',
      status: 'paid' as const,
      date: purchase.purchaseDate,
      description: 'Template Purchase',
      transactionId: purchase.transactionId,
      paymentMethod: purchase.paymentMethod,
      templatePurchase: purchase,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const activeSubscription = subscriptions.find((sub) => sub.status === 'active') || null;
  const totalSpent = transactions
    .filter((t) => t.status === 'paid')
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    data: {
      activeSubscription,
      totalSpent,
      transactions,
    } as BillingSummary,
    isLoading: subscriptionsLoading || purchasesLoading,
  };
}

/**
 * Cancel subscription mutation
 */
export function useCancelSubscription() {
  const queryClient = useQueryClient();

  return useMutation<UserSubscription, Error, string>({
    mutationFn: async (subscriptionId) => {
      const response = await api.post<UserSubscription>(`/subscriptions/${subscriptionId}/cancel`, {});
      if (!response.success) {
        throw new Error(response.error || 'Failed to cancel subscription');
      }
      if (!response.data) {
        throw new Error('Subscription data not found');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: billingKeys.subscriptions() });
      queryClient.invalidateQueries({ queryKey: billingKeys.summary() });
      toast.success('Subscription cancelled successfully');
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Failed to cancel subscription');
    },
  });
}

