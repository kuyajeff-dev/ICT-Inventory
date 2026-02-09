const pool = require('../db/mysql');

class ClassificationModel {
  static async getAll() {
    const [rows] = await pool.query(`
      SELECT id, classification_name AS name
      FROM asset_classifications
      ORDER BY classification_name
    `);
    return rows;
  }
}

module.exports = ClassificationModel;
