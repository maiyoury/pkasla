import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useSubscriptionPlans } from "@/hooks/api/useSubscriptionPlan";
import { PlanCard } from "./PlanCard";

interface AvailablePlansCardProps {
  onSubscribe: (planId: string) => void;
}

export function AvailablePlansCard({ onSubscribe }: AvailablePlansCardProps) {
  const { data: subscriptionPlans } = useSubscriptionPlans(true);

  if (!subscriptionPlans || subscriptionPlans.length === 0) {
    return null;
  }

  return (
    <Card className="border border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-black">Available Plans</CardTitle>
        <CardDescription>Choose a subscription plan that fits your needs</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {subscriptionPlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} onSubscribe={onSubscribe} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

