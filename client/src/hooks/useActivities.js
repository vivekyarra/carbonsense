/**
 * @file Hook for fetching activities.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

/**
 * @description Hook for fetching paginated activities and deleting activities.
 * @param {number} page - Current page number (1-indexed).
 * @param {number} limit - Maximum number of activities per page.
 * @returns {object} Query result with activities data and a deleteActivity mutation.
 */
export function useActivities(page = 1, limit = 20) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['activities', page, limit],
    /** @description Fetches a paginated list of activities from the API. */
    queryFn: async () => {
      const { data } = await api.get(`/activities?page=${page}&limit=${limit}`);
      return data;
    },
    keepPreviousData: true
  });

  const deleteMutation = useMutation({
    /**
     * @description Deletes an activity by ID.
     * @param {string} id - The activity ID to delete.
     */
    mutationFn: (id) => api.delete(`/activities/${id}`),
    /** @description Invalidates activity and dashboard caches after successful deletion. */
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
