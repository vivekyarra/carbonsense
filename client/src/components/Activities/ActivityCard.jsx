/**
 * @file Card to display a single activity.
 */


import PropTypes from 'prop-types';
import { CATEGORIES, SUBCATEGORIES } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';
import { Trash2 } from 'lucide-react';
import { Button } from '../common/Button';

/**
 * @description Displays a single activity entry with category, emissions, date, and delete action.
 * @param {object} props
 * @param {object} props.activity - The activity data object.
 * @param {function(string|number): void} props.onDelete - Callback invoked with activity ID when delete is clicked.
 */
export function ActivityCard({ activity, onDelete }) {
  const category = CATEGORIES.find(c => c.id === activity.category);
  const subcategoryList = SUBCATEGORIES[activity.category] || [];
  const subcategory = subcategoryList.find(s => s.id === activity.subcategory);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4">
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center text-white"
          style={{ backgroundColor: category?.color || '#9ca3af' }}
          aria-hidden="true"
        >
          {category?.label.charAt(0) || '?'}
        </div>
        <div>
          <h4 className="font-medium text-gray-900">{subcategory?.label || activity.subcategory}</h4>
          <p className="text-sm text-gray-500">
            {activity.quantity} {activity.unit} • {formatDate(activity.activity_date)}
          </p>
          {activity.notes && (
            <p className="text-xs text-gray-400 mt-1 italic">{activity.notes}</p>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="text-lg font-bold text-gray-900">{activity.co2_kg.toFixed(1)}</p>
          <p className="text-xs text-gray-500">kg CO2e</p>
        </div>
        
        <div className="flex flex-col space-y-1 sm:space-y-0 sm:flex-row sm:space-x-2">
          {/* onEdit not fully implemented yet, just a placeholder */}
          {/* <Button variant="ghost" onClick={() => onEdit(activity)} className="p-1 text-gray-400 hover:text-blue-600" aria-label={`Edit ${subcategory?.label} activity`}>
            <Edit className="w-4 h-4" />
          </Button> */}
          <Button variant="ghost" onClick={() => onDelete(activity.id)} className="p-1 text-gray-400 hover:text-red-600" aria-label={`Delete ${subcategory?.label} activity`}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

ActivityCard.propTypes = {
  activity: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    category: PropTypes.string.isRequired,
    subcategory: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    unit: PropTypes.string.isRequired,
    activity_date: PropTypes.string.isRequired,
    co2_kg: PropTypes.number.isRequired,
    notes: PropTypes.string,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};
