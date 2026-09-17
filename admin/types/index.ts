export type { Permission, Role, Session } from "./roles";
export { PERMISSIONS, hasPermission, isMain, decodeSession, isExpired } from "./roles";

export type Paged<T> = {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  nextCursor?: string;
};

export type AdminUser = {
  uid?: string;
  id?: string;
  username?: string;
  email?: string;
  phone?: string;
  banned?: boolean;
  status?: string;
  lastActive?: string;
  [k: string]: unknown;
};

export type Category = { id: string; name: string; img: string; createdAt?: string };

export type Match = {
  id: string;
  title?: string;
  matchNumber?: string;
  categoryId?: string;
  category?: string;
  timeDate?: string;
  status?: "upcoming" | "ongoing" | "result" | string;
  prizePool?: number;
  entryFee?: number;
  slots?: number;
  [k: string]: unknown;
};

export type Deposit = {
  id?: string;
  orderId?: string;
  uid?: string;
  username?: string;
  email?: string;
  phone?: string;
  amount?: number;
  status?: string;
  createdAt?: string;
  [k: string]: unknown;
};

export type Withdrawal = {
  id: string;
  uid?: string;
  username?: string;
  email?: string;
  upiId?: string;
  amount?: number;
  method?: string;
  status?: string;
  createdAt?: string;
  [k: string]: unknown;
};

export type NotificationItem = {
  id: string;
  title?: string;
  body?: string;
  message?: string;
  sentAt?: string;
  successCount?: number;
  reach?: number;
  [k: string]: unknown;
};

export type Staff = { id: string; email: string; permissions: string[]; createdAt?: string };
