/**
 * @file Hook for dashboard data.
 */

import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

/**
 * @description Hook that fetches all dashboard data including today's score, weekly trend, stats, and streak.
 * @returns {object} Dashboard data object with today, weekly, stats, streak, isLoading, and refetch.
 */
export function useDashboardData() {
  const todayQuery = useQuery({
    queryKey: ['dashboard', 'today'],
    /** @description Fetches today's carbon score from the API. */
    queryFn: async () => {
      const { data } = await api.get('/dashboard/today');
      return data;
    }
  });

  const weeklyQuery = useQuery({
    queryKey: ['dashboard', 'weekly'],
    /** @description Fetches the 7-day emissions trend from the API. */
    queryFn: async () => {
      const { data } = await api.get('/dashboard/weekly');
      return data;
    }
  });
  
  const statsQuery = useQuery({
    queryKey: ['dashboard', 'stats'],
    /** @description Fetches aggregated dashboard statistics from the API. */
    queryFn: async () => {
      const { data } = await api.get('/dashboard/stats');
      return data;
    }
  });

  const streakQuery = useQuery({
    queryKey: ['dashboard', 'streak'],
    /** @description Fetches the user's current activity streak from the API. */
    queryFn: async () => {
      const { data } = await api.get('/dashboard/streak');
      return data;
    }
  });

  const isLoading = todayQuery.isLoading || weeklyQuery.isLoading || statsQuery.isLoading || streakQuery.isLoading;

  return {
    today: todayQuery.data,
    weekly: weeklyQuery.data,
    stats: statsQuery.data,
    streak: streakQuery.data,
    isLoading,
    /** @description Refetches all dashboard queries simultaneously. */
    refetch: () => {
      todayQuery.refetch();
      weeklyQuery.refetch();
      statsQuery.refetch();
      streakQuery.refetch();
    }
  };
}
