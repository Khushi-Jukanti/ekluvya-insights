export interface Transaction {
  id: string;
  user_name: string;
  phone: string;
  email: string;
  coupon_code: string;
  amount: number;
  date: string;
  agent_name: string;
  agent_phone: string;
  agent_location: string;
}

export interface TransactionsResponse {
  transactions: Transaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  todayRevenue?: number;
}

export interface CouponDetails {
  code: string;
  is_active: boolean;
  discount_percent: number;
  usage_limit: number;
  plan: string;
  agent_name: string;
  agent_phone: string;
  agent_email: string;
  agent_location: string;
}

export interface CouponTransactionsResponse {
  transactions: Transaction[];
  total: number;
  coupon_code: string;
}

export interface DateRange {
  start: string;
  end: string;
}
