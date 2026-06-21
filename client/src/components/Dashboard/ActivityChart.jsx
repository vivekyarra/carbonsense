/**
 * @file Donut chart for activity breakdown.
 */


import PropTypes from 'prop-types';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CATEGORIES } from '../../utils/constants';

/**
 * @description Donut chart showing emissions breakdown by category for today.
 * @param {object} props
 * @param {object} [props.breakdown] - Object with category emission totals (transportation, food, energy).
 * @param {boolean} props.isLoading - Whether the data is still loading.
 */
export function ActivityChart({ breakdown, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-sm border border-gray-100" aria-busy="true">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-200 h-32 w-32"></div>
        </div>
      </div>
    );
  }

  const data = [
    { name: 'Transportation', value: breakdown?.transportation || 0, color: CATEGORIES.find(c => c.id === 'transportation').color },
    { name: 'Food', value: breakdown?.food || 0, color: CATEGORIES.find(c => c.id === 'food').color },
    { name: 'Energy', value: breakdown?.energy || 0, color: CATEGORIES.find(c => c.id === 'energy').color }
  ].filter(d => d.value > 0);

  if (data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-64 flex flex-col items-center justify-center">
        <h3 className="text-lg font-medium text-gray-800 mb-2">Breakdown</h3>
        <p className="text-gray-500 text-sm">No data for today yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-64 flex flex-col">
      <h3 className="text-lg font-medium text-gray-800 mb-2">Breakdown</h3>
      <div className="flex-1 min-h-0 relative" aria-label="Donut chart showing emissions by category">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value.toFixed(1)} kg`} />
            <Legend layout="horizontal" verticalAlign="bottom" align="center" />
          </PieChart>
        </ResponsiveContainer>
        {/* Screen reader only text summary */}
        <div className="sr-only">
          {data.map(d => `${d.name}: ${d.value.toFixed(1)} kg CO2e. `).join('')}
        </div>
      </div>
    </div>
  );
}

ActivityChart.propTypes = {
  breakdown: PropTypes.shape({
    transportation: PropTypes.number,
    food: PropTypes.number,
    energy: PropTypes.number,
  }),
  isLoading: PropTypes.bool.isRequired,
};
