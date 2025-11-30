import { Receipt } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TransactionStatusBadge } from "./TransactionStatusBadge";
import { formatDate, formatCurrency } from "@/lib/utils/billing";
import type { Transaction } from "@/hooks/api/useBilling";

interface TransactionHistoryTableProps {
  transactions: Transaction[];
}

export function TransactionHistoryTable({ transactions }: TransactionHistoryTableProps) {
  return (
    <Card className="border border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-black">Transaction History</CardTitle>
        <CardDescription>View all your payment transactions</CardDescription>
      </CardHeader>
      <CardContent>
        {transactions && transactions.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Transaction ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="text-sm">
                    {formatDate(transaction.date)}
                  </TableCell>
                  <TableCell className="text-sm font-medium">{transaction.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {transaction.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm font-semibold">
                    {formatCurrency(transaction.amount, transaction.currency)}
                  </TableCell>
                  <TableCell>
                    <TransactionStatusBadge status={transaction.status} />
                  </TableCell>
                  <TableCell className="text-xs text-gray-500 font-mono">
                    {transaction.transactionId || "N/A"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-gray-600">
            <Receipt className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>No transactions found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

