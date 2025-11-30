"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  CurrentSubscriptionCard,
  AvailablePlansCard,
  TransactionHistoryTable,
  PaymentDrawer,
} from "@/components/billing";
import { useBillingSummary, useMyActiveSubscription } from "@/hooks/api/useBilling";

export default function BillingPage() {
  const { data: billingSummary, isLoading } = useBillingSummary();
  const { data: activeSubscription } = useMyActiveSubscription();

  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  const handleSubscribe = (planId: string) => {
    setSelectedPlan(planId);
    setIsPaymentDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Billing</h1>
          <p className="text-gray-600 mt-2">Manage your subscription and payment methods</p>
        </div>
      </div>

      <CurrentSubscriptionCard onSubscribeClick={() => setIsPaymentDialogOpen(true)} />

      {!activeSubscription && (
        <AvailablePlansCard onSubscribe={handleSubscribe} />
      )}

      <TransactionHistoryTable
        transactions={billingSummary?.transactions || []}
      />

      <PaymentDrawer
        open={isPaymentDialogOpen}
        onOpenChange={setIsPaymentDialogOpen}
        planId={selectedPlan}
      />
    </div>
  );
}
