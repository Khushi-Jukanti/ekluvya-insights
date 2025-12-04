import { useState } from "react";
import { Search, Tag, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import TransactionsTable from "@/components/TransactionsTable";
import DateRangePicker from "@/components/DateRangePicker";
import Pagination from "@/components/Pagination";
import ExportButton from "@/components/ExportButton";
import CouponSearchModal from "@/components/CouponSearchModal";
import CouponUsersModal from "@/components/CouponUsersModal";
import { useTransactions } from "@/hooks/useTransactions";
import { DateRange } from "@/types";
import { toast } from "sonner";
import { format, subDays } from "date-fns";

const Index = () => {
  const [page, setPage] = useState(1);
  const [couponFilter, setCouponFilter] = useState("");
  const [appliedCouponFilter, setAppliedCouponFilter] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({
    start: format(subDays(new Date(), 30), "yyyy-MM-dd"),
    end: format(new Date(), "yyyy-MM-dd"),
  });
  const [couponSearchOpen, setCouponSearchOpen] = useState(false);
  const [couponUsersOpen, setCouponUsersOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState("");

  const { data, isLoading, error, refetch, isFetching } = useTransactions({
    page,
    limit: 20,
    dateRange,
    coupon: appliedCouponFilter,
  });

  const handleCouponFilterApply = () => {
    setAppliedCouponFilter(couponFilter);
    setPage(1);
  };

  const handleCouponClick = (code: string) => {
    setSelectedCoupon(code);
    setCouponUsersOpen(true);
  };

  const handleViewUsersFromSearch = (code: string) => {
    setSelectedCoupon(code);
    setCouponSearchOpen(false);
    setCouponUsersOpen(true);
  };

  const handleRefresh = () => {
    refetch();
    toast.success("Data refreshed");
  };

  if (error) {
    toast.error("Failed to load transactions", {
      description: "Please check your connection and try again",
    });
  }

  return (
    <div className="min-h-screen bg-background bg-grid-pattern">
      <Navbar
        totalTransactions={data?.total || 0}
        todayRevenue={data?.todayRevenue || 0}
        isLoading={isLoading}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">All Transactions</h2>
              <p className="text-muted-foreground">
                View and manage subscription transactions
              </p>
            </div>
            <Button
              variant="glow"
              onClick={() => setCouponSearchOpen(true)}
              className="gap-2"
            >
              <Tag className="h-4 w-4" />
              Search Coupon
            </Button>
          </div>

          {/* Filters */}
          <div className="glass-card rounded-xl p-4">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <div className="relative flex-1 sm:w-[280px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Filter by coupon code..."
                    value={couponFilter}
                    onChange={(e) => setCouponFilter(e.target.value.toUpperCase())}
                    onKeyPress={(e) => e.key === "Enter" && handleCouponFilterApply()}
                    className="pl-10 font-mono"
                  />
                </div>
                <Button variant="secondary" onClick={handleCouponFilterApply}>
                  Apply Filter
                </Button>
                {appliedCouponFilter && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setCouponFilter("");
                      setAppliedCouponFilter("");
                    }}
                    className="text-muted-foreground"
                  >
                    Clear
                  </Button>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center w-full lg:w-auto">
                <DateRangePicker
                  dateRange={dateRange}
                  onDateRangeChange={(range) => {
                    setDateRange(range);
                    setPage(1);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {data && (
                <span>
                  Showing{" "}
                  <span className="font-medium text-foreground">
                    {(page - 1) * 20 + 1}-{Math.min(page * 20, data.total)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-foreground">{data.total}</span>{" "}
                  transactions
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isFetching}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <ExportButton
                transactions={data?.transactions || []}
                isLoading={isLoading}
              />
            </div>
          </div>

          {/* Table */}
          <TransactionsTable
            transactions={data?.transactions || []}
            isLoading={isLoading}
            onCouponClick={handleCouponClick}
          />

          {/* Pagination */}
          {data && (
            <Pagination
              currentPage={page}
              totalPages={data.totalPages}
              onPageChange={setPage}
              isLoading={isLoading}
            />
          )}
        </div>
      </main>

      {/* Modals */}
      <CouponSearchModal
        open={couponSearchOpen}
        onOpenChange={setCouponSearchOpen}
        onViewUsers={handleViewUsersFromSearch}
      />

      <CouponUsersModal
        open={couponUsersOpen}
        onOpenChange={setCouponUsersOpen}
        couponCode={selectedCoupon}
      />
    </div>
  );
};

export default Index;
