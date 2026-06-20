/**
 * @file Card for displaying a tip.
 */


import { BookmarkPlus, BookmarkCheck } from 'lucide-react';

/**
 *
 * @param root0
 * @param root0.tip
 * @param root0.onToggleSave
 * @param root0.isSaved
 */
export function TipCard({ tip, onToggleSave, isSaved }) {
  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full uppercase tracking-wide">
          {tip.category}
        </span>
        <button
          onClick={() => onToggleSave(tip)}
          className={`p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 ${isSaved ? 'text-green-600' : 'text-gray-400'}`}
          aria-label={isSaved ? 'Unsave tip' : 'Save tip'}
        >
          {isSaved ? <BookmarkCheck className="w-5 h-5" /> : <BookmarkPlus className="w-5 h-5" />}
        </button>
      </div>
      
      <h4 className="text-lg font-medium text-gray-900 mb-2">{tip.title}</h4>
      <p className="text-sm text-gray-600 mb-4 flex-1">{tip.description}</p>
      
      <div className="mt-auto pt-4 border-t border-gray-100">
        <p className="text-sm">
          <span className="font-semibold text-green-600">Potential Saving: </span>
          <span className="text-gray-700">~{tip.potential_saving_kg} kg CO2e</span>
        </p>
      </div>
    </div>
  );
}
