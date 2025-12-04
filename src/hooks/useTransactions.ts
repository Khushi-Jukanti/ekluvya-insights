import { useQuery } from "@tanstack/react-query";
import { TransactionsResponse, DateRange } from "@/types";
import { BASE_URL } from "@/config/api";

interface UseTransactionsParams {
  page: number;
  limit: number;
  dateRange?: DateRange;
  coupon?: string;
}

export const fetchTransactions = async ({
  page,
  limit,
  dateRange,
  coupon,
}: UseTransactionsParams): Promise<TransactionsResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (dateRange?.start) params.append("start", dateRange.start);
  if (dateRange?.end) params.append("end", dateRange.end);
  if (coupon) params.append("coupon", coupon);

  const response = await fetch(`${BASE_URL}/transactions?${params}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch transactions");
  }
  
  return response.json();
};

export const useTransactions = (params: UseTransactionsParams) => {
  return useQuery({
    queryKey: ["transactions", params],
    queryFn: () => fetchTransactions(params),
    staleTime: 30000,
    retry: 2,
  });
};
