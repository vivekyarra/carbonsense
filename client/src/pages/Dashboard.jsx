/**
 * @file Dashboard page.
 */


import { Link } from 'react-router-dom';
import { useDashboardData } from '../hooks/useCarbonScore';
import { CarbonScore } from '../components/Dashboard/CarbonScore';
import { ActivityChart } from '../components/Dashboard/ActivityChart';
import { WeeklyTrend } from '../components/Dashboard/WeeklyTrend';
import { CommunityComparison } from '../components/Dashboard/CommunityComparison';
import { ActivityList } from '../components/Activities/ActivityList';

/**
 *
 */
export default function Dashboard() {
  const { today, weekly, stats, isLoading } = useDashboardData();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Your Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <CarbonScore todayData={today} targetKg={today?.target_kg || 10} isLoading={isLoading} />
          <ActivityChart breakdown={today?.breakdown} isLoading={isLoading} />
        </div>
        
        <div className="lg:col-span-2 space-y-6">
          <WeeklyTrend data={weekly} isLoading={isLoading} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CommunityComparison stats={stats} isLoading={isLoading} />
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col h-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-800">Recent Activities</h2>
                <Link to="/history" className="text-sm text-green-700 hover:text-green-800 font-medium underline-offset-2 hover:underline">View All</Link>
              </div>
              <div className="flex-1 overflow-y-auto pr-2">
                <ActivityList limit={3} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
