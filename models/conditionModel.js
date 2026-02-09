const pool = require('../db/mysql');

class ConditionModel {
  static async getAll() {
    const [rows] = await pool.query(`
    SELECT id, condition_name AS name
    FROM asset_conditions
    ORDER BY condition_name
    `);
    return rows;
  }
}

module.exports = ConditionModel;
