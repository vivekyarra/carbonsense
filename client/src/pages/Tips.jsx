/**
 * @file Tips page.
 */

import { useState } from 'react';
import { TipsPanel } from '../components/Tips/TipsPanel';

/**
 *
 */
export default function Tips() {
  const [tab, setTab] = useState('personalized');

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reduction Tips</h1>
        <p className="text-gray-600 mt-1">Discover ways to reduce your carbon footprint and save energy.</p>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <div className="-mb-px flex space-x-8" role="tablist" aria-label="Tip categories">
          <button
            id="personalized-tab"
            type="button"
            role="tab"
            aria-selected={tab === 'personalized'}
            aria-controls="tips-panel"
            onClick={() => setTab('personalized')}
            className={`${
              tab === 'personalized'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Personalized For You
          </button>
          <button
            id="all-tab"
            type="button"
            role="tab"
            aria-selected={tab === 'all'}
            aria-controls="tips-panel"
            onClick={() => setTab('all')}
            className={`${
              tab === 'all'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            All Tips
          </button>
        </div>
      </div>

      <section
        id="tips-panel"
        role="tabpanel"
        aria-labelledby={tab === 'personalized' ? 'personalized-tab' : 'all-tab'}
      >
        <TipsPanel personalized={tab === 'personalized'} />
      </section>
    </div>
  );
}
