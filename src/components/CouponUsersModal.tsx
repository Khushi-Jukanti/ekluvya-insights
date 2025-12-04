import { useState } from "react";
import { Users, Calendar, Phone, CreditCard, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCouponTransactions } from "@/hooks/useCouponSearch";
import { format, parseISO } from "date-fns";
import Pagination from "./Pagination";

interface CouponUsersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  couponCode: string;
}

const CouponUsersModal = ({ open, onOpenChange, couponCode }: CouponUsersModalProps) => {
  const [page, setPage] = useState(1);
  
  const { data, isLoading } = useCouponTransactions(
    couponCode,
    page,
    open && couponCode.length > 0
  );

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, "MMM d, yyyy h:mm a");
    } catch {
      return dateString;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[85vh] glass-card-elevated border-border/50">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center">
                <Users className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <span>Users for Coupon</span>
                <Badge variant="outline" className="ml-2 font-mono">
                  {couponCode}
                </Badge>
              </div>
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {data && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
              <Users className="h-5 w-5 text-primary" />
              <span className="font-semibold text-primary">
                Total Users: {data.total}
              </span>
            </div>
          )}

          <div className="rounded-lg overflow-hidden border border-border/50 max-h-[400px] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-card">
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="text-muted-foreground font-semibold">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Date & Time
                    </div>
                  </TableHead>
                  <TableHead className="text-muted-foreground font-semibold">User Name</TableHead>
                  <TableHead className="text-muted-foreground font-semibold">
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      Phone
                    </div>
                  </TableHead>
                  <TableHead className="text-muted-foreground font-semibold text-right">
                    <div className="flex items-center justify-end gap-1">
                      <CreditCard className="h-4 w-4" />
                      Amount
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 4 }).map((_, j) => (
                        <TableCell key={j}>
                          <div className="h-4 shimmer rounded w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : data?.transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Users className="h-8 w-8" />
                        <p>No users found for this coupon</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.transactions.map((transaction, index) => (
                    <TableRow
                      key={transaction.id || index}
                      className="table-row-hover border-border/30"
                    >
                      <TableCell className="text-sm">
                        {formatDate(transaction.date)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {transaction.user_name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {transaction.phone}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-success">
                        ₹{transaction.amount.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {data && data.total > 20 && (
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(data.total / 20)}
              onPageChange={setPage}
              isLoading={isLoading}
            />
          )}

          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CouponUsersModal;
