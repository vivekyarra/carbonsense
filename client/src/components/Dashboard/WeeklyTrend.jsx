/**
 * @file Weekly trend bar chart component.
 */


import PropTypes from 'prop-types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

/**
 * @description Bar chart displaying the 7-day emissions trend.
 * @param {object} props
 * @param {object} [props.data] - Weekly trend data with a trend array of daily totals.
 * @param {boolean} props.isLoading - Whether the data is still loading.
 */
export function WeeklyTrend({ data, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-sm border border-gray-100" aria-busy="true" role="status">
        <div className="animate-pulse w-full h-full p-6">
          <div className="h-full bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Format dates for display
  const formattedData = data?.trend?.map(d => {
    const date = new Date(d.date);
    return {
      ...d,
      displayDate: new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date)
    };
  }) || [];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-64 flex flex-col">
      <h2 className="text-lg font-medium text-gray-800 mb-4">7-Day Trend</h2>
      <div className="flex-1 min-h-0 min-w-0 w-full relative" role="img" aria-label="Bar chart showing emissions over the last 7 days">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <BarChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="displayDate" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
            <Tooltip 
              cursor={{ fill: '#f3f4f6' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              formatter={(value) => [`${value} kg`, 'CO2e']}
              labelFormatter={(label) => `Day: ${label}`}
            />
            <Bar dataKey="total" fill="#16a34a" radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
        {/* Screen reader only text summary */}
        <div className="sr-only">
          {formattedData.map(d => `${d.displayDate}: ${d.total} kg CO2e. `).join('')}
        </div>
      </div>
    </div>
  );
}

WeeklyTrend.propTypes = {
  data: PropTypes.shape({
    trend: PropTypes.arrayOf(
      PropTypes.shape({
        date: PropTypes.string.isRequired,
        total: PropTypes.number.isRequired,
      })
    ),
  }),
  isLoading: PropTypes.bool.isRequired,
};
