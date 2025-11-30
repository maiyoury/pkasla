import { CheckCircle2, Clock, AlertCircle, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Transaction } from "@/hooks/api/useBilling";

interface TransactionStatusBadgeProps {
  status: Transaction["status"];
}

export function TransactionStatusBadge({ status }: TransactionStatusBadgeProps) {
  const variants = {
    paid: { variant: "default" as const, icon: CheckCircle2, label: "Paid" },
    pending: { variant: "secondary" as const, icon: Clock, label: "Pending" },
    failed: { variant: "destructive" as const, icon: AlertCircle, label: "Failed" },
    cancelled: { variant: "outline" as const, icon: X, label: "Cancelled" },
  };

  const config = variants[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}

