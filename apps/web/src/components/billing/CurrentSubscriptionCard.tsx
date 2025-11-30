import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMyActiveSubscription, useCancelSubscription } from "@/hooks/api/useBilling";
import { formatDate, formatCurrency } from "@/lib/utils/billing";
import type { SubscriptionPlan } from "@/types/subscription-plan";
import type { UserSubscription } from "@/types/user-subscription";

interface CurrentSubscriptionCardProps {
  onSubscribeClick: () => void;
}

export function CurrentSubscriptionCard({ onSubscribeClick }: CurrentSubscriptionCardProps) {
  const { data: activeSubscription } = useMyActiveSubscription();
  const cancelSubscriptionMutation = useCancelSubscription();

  const plan = activeSubscription
    ? typeof activeSubscription.planId === "object"
      ? activeSubscription.planId
      : null
    : null;

  const handleCancelSubscription = async () => {
    if (!activeSubscription) return;

    if (confirm("Are you sure you want to cancel your subscription?")) {
      try {
        await cancelSubscriptionMutation.mutateAsync(activeSubscription.id);
      } catch {
        // Error handled by mutation
      }
    }
  };

  return (
    <Card className="border border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-black">Current Subscription</CardTitle>
        <CardDescription>Your active subscription plan and billing information</CardDescription>
      </CardHeader>
      <CardContent>
        {activeSubscription && plan ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-black">{plan.displayName}</h3>
                <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
              </div>
              <Badge variant={activeSubscription.status === "active" ? "default" : "secondary"}>
                {activeSubscription.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div>
                <p className="text-sm text-gray-600">Billing Cycle</p>
                <p className="text-sm font-semibold text-black capitalize">
                  {plan.billingCycle}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Price</p>
                <p className="text-sm font-semibold text-black">
                  {formatCurrency(plan.price)} / {plan.billingCycle === "monthly" ? "month" : "year"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Start Date</p>
                <p className="text-sm font-semibold text-black">
                  {formatDate(activeSubscription.startDate)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">End Date</p>
                <p className="text-sm font-semibold text-black">
                  {formatDate(activeSubscription.endDate)}
                </p>
              </div>
            </div>

            {activeSubscription.status === "active" && (
              <Button
                variant="destructive"
                onClick={handleCancelSubscription}
                disabled={cancelSubscriptionMutation.isPending}
                className="w-full mt-4"
              >
                {cancelSubscriptionMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  "Cancel Subscription"
                )}
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">You don&apos;t have an active subscription</p>
            <Button onClick={onSubscribeClick}>Subscribe Now</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

