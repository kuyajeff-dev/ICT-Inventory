const pool = require('../db/mysql');

class UomModel {
  static async getAll() {
    const [rows] = await pool.query(`
      SELECT id, uom_name AS name
      FROM units_of_measure
      ORDER BY uom_name
    `);
    return rows;
  }
}

module.exports = UomModel;
