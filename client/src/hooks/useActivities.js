/**
 * @file Hook for fetching activities.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

/**
 *
 * @param page
 * @param limit
 */
export function useActivities(page = 1, limit = 20) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['activities', page, limit],
    /**
     *
     */
    queryFn: async () => {
      const { data } = await api.get(`/activities?page=${page}&limit=${limit}`);
      return data;
    },
    keepPreviousData: true
  });

  const deleteMutation = useMutation({
    /**
     *
     * @param id
     */
    mutationFn: (id) => api.delete(`/activities/${id}`),
    /**
     *
     */
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    }
  });

  return {
    ...query,
    deleteActivity: deleteMutation.mutate
  };
}
