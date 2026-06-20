/**
 * @file History page.
 */


import { ActivityList } from '../components/Activities/ActivityList';

/**
 *
 */
export default function History() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activity History</h1>
          <p className="text-gray-600 mt-1">View and manage all your logged activities.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <ActivityList limit={10} showPagination={true} />
      </div>
    </div>
  );
}
