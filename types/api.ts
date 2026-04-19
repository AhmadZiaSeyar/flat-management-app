export type PermissionName =
  | 'create_user'
  | 'view_user'
  | 'assign_role'
  | 'add_expense'
  | 'view_expense'
  | 'view_reports'
  | 'view_food_timetable';

export type RoleName = 'Admin' | 'Member';

export interface AppUser {
  id: string;
  fullName: string;
  username: string | null;
  phone: string | null;
  email: string | null;
  isActive: boolean;
  roles: RoleName[];
  permissions: PermissionName[];
}

export interface AuthResponse {
  user: AppUser;
  accessToken: string;
  refreshToken: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  sortOrder: number;
  isActive: boolean;
}

export interface Expense {
  id: string;
  amount: number;
  note: string | null;
  expenseDate: string;
  createdAt: string;
  category: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
  createdBy: {
    id: string;
    fullName: string;
    username: string | null;
    email?: string | null;
  };
}

export interface ReportBreakdownItem {
  id: string;
  name?: string;
  fullName?: string;
  color?: string;
  total: number;
}

export interface DailyTotal {
  date: string;
  total: number;
}

export interface BudgetSummary {
  id?: string;
  year: number;
  month: number;
  amount: number;
  spent: number;
  remaining: number;
  percentageUsed: number;
  setBy?: {
    id: string;
    fullName: string;
  } | null;
  updatedAt?: string | null;
}

export interface FoodTimetableDay {
  dayOfWeek: number;
  breakfast: string | null;
  lunch: string | null;
  dinner: string | null;
  note: string | null;
  updatedAt: string | null;
  updatedBy: {
    id: string;
    fullName: string;
  } | null;
}

export interface ReportResponse {
  scope: 'weekly' | 'monthly';
  startDate: string;
  endDate: string;
  total: number;
  expenseCount: number;
  byCategory: Array<ReportBreakdownItem & { name: string; color: string }>;
  byUser: Array<ReportBreakdownItem & { fullName: string }>;
  dailyTotals: DailyTotal[];
  budget: {
    amount: number;
    spent: number;
    remaining: number;
    percentageUsed: number;
  } | null;
}

export interface RoleOption {
  id: string;
  name: RoleName;
  description: string | null;
  permissions: PermissionName[];
}

export interface ManagedUser extends AppUser {
  createdAt: string;
}
