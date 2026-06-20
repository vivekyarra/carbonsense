/**
 * @file Hook for dashboard data.
 */

import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

/**
 *
 */
export function useDashboardData() {
  const todayQuery = useQuery({
    queryKey: ['dashboard', 'today'],
    /**
     *
     */
    queryFn: async () => {
      const { data } = await api.get('/dashboard/today');
      return data;
    }
  });

  const weeklyQuery = useQuery({
    queryKey: ['dashboard', 'weekly'],
    /**
     *
     */
    queryFn: async () => {
      const { data } = await api.get('/dashboard/weekly');
      return data;
    }
  });
  
  const statsQuery = useQuery({
    queryKey: ['dashboard', 'stats'],
    /**
     *
     */
    queryFn: async () => {
      const { data } = await api.get('/dashboard/stats');
      return data;
    }
  });

  const streakQuery = useQuery({
    queryKey: ['dashboard', 'streak'],
    /**
     *
     */
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
    /**
     *
     */
    refetch: () => {
      todayQuery.refetch();
      weeklyQuery.refetch();
      statsQuery.refetch();
      streakQuery.refetch();
    }
  };
}
