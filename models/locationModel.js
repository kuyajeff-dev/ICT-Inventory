const pool = require('../db/mysql');

class LocationModel {
  static async getAll() {
    const [rows] = await pool.query(`
      SELECT id, location_name AS name
      FROM locations
      ORDER BY location_name
    `);
    return rows;
  }
}

module.exports = LocationModel;
