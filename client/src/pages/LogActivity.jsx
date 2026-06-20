/**
 * @file Log Activity page.
 */


import { useNavigate } from 'react-router-dom';
import { ActivityForm } from '../components/Activities/ActivityForm';

/**
 *
 */
export default function LogActivity() {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Log Activity</h1>
        <p className="text-gray-600 mt-1">Record your transportation, food, or energy usage to track its carbon impact.</p>
      </div>

      <ActivityForm onSuccess={() => navigate('/')} />
    </div>
  );
}
