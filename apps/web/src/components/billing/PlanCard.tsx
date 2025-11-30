import { CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { SubscriptionPlan } from "@/types/subscription-plan";
import { formatCurrency } from "@/lib/utils/billing";

interface PlanCardProps {
  plan: SubscriptionPlan;
  onSubscribe: (planId: string) => void;
}

export function PlanCard({ plan, onSubscribe }: PlanCardProps) {
  return (
    <Card className="border border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg">{plan.displayName}</CardTitle>
        <div className="mt-2">
          <span className="text-3xl font-bold">{formatCurrency(plan.price)}</span>
          <span className="text-gray-600 text-sm">
            /{plan.billingCycle === "monthly" ? "month" : "year"}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 mb-4">
          {plan.features.map((feature, index) => (
            <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
        <Button
          onClick={() => onSubscribe(plan.id)}
          className="w-full"
          variant="outline"
        >
          Subscribe
        </Button>
      </CardContent>
    </Card>
  );
}

