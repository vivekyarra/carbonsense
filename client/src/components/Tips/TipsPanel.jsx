/**
 * @file Panel displaying list of tips.
 */


import PropTypes from 'prop-types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { TipCard } from './TipCard';

/**
 * @description Queries and renders personalized or general reduction tips.
 * @param {object} props - Component properties.
 * @param {boolean} [props.personalized] - Whether to prioritize relevant tips.
 * @param {number|null} [props.limit] - Maximum number of tips.
 */
export function TipsPanel({ personalized = false, limit = null }) {
  const queryClient = useQueryClient();
  
  const endpoint = personalized ? '/tips' : '/tips/all';
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ['tips', personalized ? 'personalized' : 'all'],
    /**
     *
     */
    queryFn: async () => {
      const { data } = await api.get(endpoint);
      return data.tips;
    }
  });

  const toggleSaveMutation = useMutation({
    /**
     *
     * @param tip
     */
    mutationFn: async (tip) => {
      if (tip.is_saved) {
        return api.delete(`/tips/${tip.id}/save`);
      } else {
        return api.post(`/tips/${tip.id}/save`);
      }
    },
    /**
     *
     */
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tips'] });
    }
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse bg-white h-48 rounded-lg shadow-sm border border-gray-100"></div>
        ))}
      </div>
    );
  }

  if (isError) {
    return <p className="text-red-700" role="alert">Failed to load tips.</p>;
  }

  let displayTips = data || [];
  if (limit) {
    displayTips = displayTips.slice(0, limit);
  }

  if (displayTips.length === 0) {
    return <p className="text-gray-500">No tips available right now.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayTips.map(tip => (
        <TipCard 
          key={tip.id} 
          tip={tip} 
          isSaved={tip.is_saved}
          onToggleSave={toggleSaveMutation.mutate}
        />
      ))}
    </div>
  );
}

TipsPanel.propTypes = {
  personalized: PropTypes.bool,
  limit: PropTypes.number,
};
