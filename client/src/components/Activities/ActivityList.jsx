/**
 * @file List of recent activities.
 */
import React from 'react';
import PropTypes from 'prop-types';


import { useActivities } from '../../hooks/useActivities';
import { ActivityCard } from './ActivityCard';

/**
 * @description Renders a paginated list of activity cards with loading/error states.
 * @param {object} props
 * @param {number} [props.limit] - Maximum number of activities per page.
 * @param {boolean} [props.showPagination] - Whether to show pagination controls.
 */
export function ActivityList({ limit = 5, showPagination = false }) {
  const [page, setPage] = React.useState(1);
  const { data, isLoading, isError, deleteActivity } = useActivities(page, limit);

  if (isLoading) {
    return (
      <div className="space-y-4" aria-busy="true" role="status">
        <span className="sr-only">Loading activities</span>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse bg-white p-4 rounded-lg shadow-sm border border-gray-100 h-24"></div>
        ))}
      </div>
    );
  }

  if (isError) {
    return <p className="text-red-700" role="alert">Failed to load activities.</p>;
  }

  const activities = data?.data || [];
  const totalPages = data?.pagination?.pages || 1;

  if (activities.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <p className="text-gray-500">No activities logged yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map(activity => (
        <ActivityCard 
          key={activity.id} 
          activity={activity} 
          onDelete={deleteActivity} 
          onEdit={() => {}} 
        />
      ))}
      
      {showPagination && totalPages > 1 && (
        <nav className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200" aria-label="Activity pages">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
            aria-label="Previous activity page"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
            aria-label="Next activity page"
          >
            Next
          </button>
        </nav>
      )}
    </div>
  );
}

ActivityList.propTypes = {
  limit: PropTypes.number,
  showPagination: PropTypes.bool,
};
