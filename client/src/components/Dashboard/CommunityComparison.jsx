/**
 * @file Community comparison component.
 */


import PropTypes from 'prop-types';

/**
 * @description Horizontal bar comparison showing user's daily average vs global average and Paris Agreement target.
 * @param {object} props
 * @param {object} [props.stats] - Dashboard stats containing user average and comparison data.
 * @param {boolean} props.isLoading - Whether the data is still loading.
 */
export function CommunityComparison({ stats, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48 bg-white rounded-lg shadow-sm border border-gray-100" aria-busy="true">
        <div className="animate-pulse w-full p-6 space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const userAvg = stats.user_daily_average_kg || 0;
  const globalAvg = stats.comparisons?.global_average_kg || 12.9;
  const parisTarget = stats.comparisons?.paris_agreement_kg || 5.5;

  const maxVal = Math.max(userAvg, globalAvg, parisTarget) * 1.1;

  /**
   * @description Calculates percentage width for a comparison bar.
   * @param {number} val - The value to calculate width for.
   * @returns {string} CSS percentage width string.
   */
  const getBarWidth = (val) => `${(val / maxVal) * 100}%`;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-lg font-medium text-gray-800 mb-4">How You Compare</h3>
      
      <div className="space-y-4" aria-label="Comparison bars showing your average against global and Paris targets">
        {/* User */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium text-green-700">Your Daily Average</span>
            <span className="text-gray-600">{userAvg.toFixed(1)} kg</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-green-500 h-2.5 rounded-full" style={{ width: getBarWidth(userAvg) }}></div>
          </div>
        </div>

        {/* Paris Target */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium text-blue-700">Paris Agreement Target</span>
            <span className="text-gray-600">{parisTarget.toFixed(1)} kg</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: getBarWidth(parisTarget) }}></div>
          </div>
        </div>

        {/* Global Average */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium text-gray-700">Global Average</span>
            <span className="text-gray-600">{globalAvg.toFixed(1)} kg</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-gray-400 h-2.5 rounded-full" style={{ width: getBarWidth(globalAvg) }}></div>
          </div>
        </div>
      </div>
      
      {/* Screen reader only text summary */}
      <div className="sr-only">
        Your daily average is {userAvg.toFixed(1)} kg CO2e. 
        The Paris Agreement target is {parisTarget.toFixed(1)} kg CO2e. 
        The Global average is {globalAvg.toFixed(1)} kg CO2e.
      </div>
    </div>
  );
}

CommunityComparison.propTypes = {
  stats: PropTypes.shape({
    user_daily_average_kg: PropTypes.number,
    comparisons: PropTypes.shape({
      global_average_kg: PropTypes.number,
      paris_agreement_kg: PropTypes.number,
    }),
  }),
  isLoading: PropTypes.bool.isRequired,
};
