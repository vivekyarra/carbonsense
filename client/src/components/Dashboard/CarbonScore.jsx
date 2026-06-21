/**
 * @file Carbon score meter component.
 */

import { useMemo } from 'react';
import PropTypes from 'prop-types';

/**
 * @description Circular gauge displaying today's total CO2 emissions against a daily target.
 * @param {object} props
 * @param {object} [props.todayData] - Today's emission data with total_kg.
 * @param {number} [props.targetKg] - Daily emission target in kilograms.
 * @param {boolean} props.isLoading - Whether the data is still loading.
 */
export function CarbonScore({ todayData, targetKg = 10, isLoading }) {
  
  const scoreData = useMemo(() => {
    if (!todayData) return { total: 0, percentage: 0, colorClass: 'text-green-500', strokeClass: 'stroke-green-500' };
    
    const total = todayData.total_kg || 0;
    const percentage = Math.min((total / targetKg) * 100, 100);
    
    let colorClass = 'text-green-500';
    let strokeClass = 'stroke-green-500';
    
    if (total >= targetKg) {
      colorClass = 'text-red-600';
      strokeClass = 'stroke-red-600';
    } else if (total >= targetKg * 0.8) {
      colorClass = 'text-yellow-500';
      strokeClass = 'stroke-yellow-500';
    }
    
    return { total, percentage, colorClass, strokeClass };
  }, [todayData, targetKg]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48 bg-white rounded-lg shadow-sm border border-gray-100" aria-busy="true" role="status">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-32 h-32 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    );
  }

  // Circular progress math
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scoreData.percentage / 100) * circumference;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center justify-center">
      <h2 className="text-lg font-medium text-gray-800 mb-2">Today's Footprint</h2>
      
      <div className="relative flex items-center justify-center" role="img" aria-label={`Carbon score: ${scoreData.total} kilograms of carbon dioxide equivalent`}>
        {/* Background circle */}
        <svg className="w-40 h-40 transform -rotate-90" aria-hidden="true" role="presentation">
          <circle
            className="text-gray-200 stroke-current"
            strokeWidth="8"
            cx="80"
            cy="80"
            r={radius}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            className={`${scoreData.strokeClass} transition-all duration-1000 ease-in-out`}
            strokeWidth="8"
            strokeLinecap="round"
            cx="80"
            cy="80"
            r={radius}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className={`text-3xl font-bold ${scoreData.colorClass}`}>
            {scoreData.total.toFixed(1)}
          </span>
          <span className="text-xs text-gray-500 uppercase tracking-wide">kg CO2e</span>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Daily Target: <span className="font-semibold text-gray-800">{targetKg} kg</span>
        </p>
        <p className="text-xs mt-1 text-gray-500">
          {scoreData.total >= targetKg ? (
            <span className="text-red-500 font-medium">Target exceeded</span>
          ) : (
            <span>You have {(targetKg - scoreData.total).toFixed(1)} kg remaining</span>
          )}
        </p>
      </div>
    </div>
  );
}

CarbonScore.propTypes = {
  todayData: PropTypes.shape({
    total_kg: PropTypes.number,
  }),
  targetKg: PropTypes.number,
  isLoading: PropTypes.bool.isRequired,
};
