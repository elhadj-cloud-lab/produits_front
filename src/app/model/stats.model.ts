export interface DashboardStats {
  totalLoginsToday: number;
  successfulLoginsToday: number;
  failedLoginsToday: number;
  successRateToday: number;
  totalUsers: number;
  hourlyStats: HourlyStat[];
  dailyStats: DailyStat[];
  recentEvents: RecentEvent[];
}

export interface HourlyStat {
  hour: number;
  total: number;
  successes: number;
  failures: number;
}

export interface DailyStat {
  day: string;
  total: number;
  successes: number;
  failures: number;
}

export interface RecentEvent {
  id: number;
  username: string;
  ipAddress: string;
  success: boolean;
  failureReason: string | null;
  eventTime: string;
}
