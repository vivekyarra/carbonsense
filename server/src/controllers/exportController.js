/**
 * @file Controller for data export.
 */

const db = require('../models/db');

/**
 * Sanitizes a CSV field to prevent CSV injection attacks.
 * Fields starting with =, +, -, @, \t, or \r are prepended with a single quote
 * to prevent spreadsheet formula injection.
 * @param {any} field - The field value to sanitize.
 * @returns {string} The sanitized, properly quoted CSV field.
 */
function sanitizeCSVField(field) {
  if (field === null || field === undefined) {
    return '""';
  }
  let str = String(field);
  // Prevent CSV injection by prepending a single quote to formula-triggering characters
  if (/^[=+\-@\t\r]/.test(str)) {
    str = "'" + str;
  }
  // Escape internal quotes and wrap every field in quotes
  return '"' + str.replace(/"/g, '""') + '"';
}

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
    csvRows.push(headers.map(sanitizeCSVField).join(','));

    for (const row of activities) {
      const values = [
        sanitizeCSVField(row.category),
        sanitizeCSVField(row.subcategory),
        sanitizeCSVField(row.quantity),
        sanitizeCSVField(row.unit),
        sanitizeCSVField(row.co2_kg),
        sanitizeCSVField(row.activity_date),
        sanitizeCSVField(row.notes),
        sanitizeCSVField(row.created_at)
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
