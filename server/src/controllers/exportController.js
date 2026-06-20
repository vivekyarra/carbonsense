/**
 * @file Controller for data export.
 */

const db = require('../models/db');

/**
 * Exports user activities as CSV.
 * @param {object} req - Express request.
 * @param {object} res - Express response.
 * @param {import('express').NextFunction} next - Next middleware.
 * @returns {void}
 */
function exportCSV(req, res, next) {
  try {
    const userId = req.user.id;

    const stmt = db.prepare(`
      SELECT category, subcategory, quantity, unit, co2_kg, activity_date, notes, created_at
      FROM activities
      WHERE user_id = ?
      ORDER BY activity_date DESC
    `);
    const activities = stmt.all(userId);

    // Build CSV content
    const headers = ['Category', 'Subcategory', 'Quantity', 'Unit', 'CO2_kg', 'Date', 'Notes', 'Logged_At'];
    const csvRows = [];
    csvRows.push(headers.join(','));

    for (const row of activities) {
      const values = [
        row.category,
        row.subcategory,
        row.quantity,
        row.unit,
        row.co2_kg,
        row.activity_date,
        // Escape quotes and commas in notes
        row.notes ? `"${row.notes.replace(/"/g, '""')}"` : '',
        row.created_at
      ];
      csvRows.push(values.join(','));
    }

    const csvData = csvRows.join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="carbonsense_activities.csv"');
    res.send(csvData);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  exportCSV
};
