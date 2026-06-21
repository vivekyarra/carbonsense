/**
 * @file Formatting utilities.
 */

/**
 * Formats a date string to a readable format.
 * @param {string} dateStr 
 * @returns {string} The formatted date string.
 */
export function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

/**
 * Formats a number to 1 or 2 decimal places.
 * @param {number} num 
 * @returns {string} The formatted number string.
 */
export function formatNumber(num) {
  if (num === null || num === undefined) return '0.0';
  return Number(num).toFixed(1);
}
