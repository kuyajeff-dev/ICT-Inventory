const pool = require('../db/mysql');

class CategoryModel {
  static async getAll() {
    const [rows] = await pool.query(`
      SELECT id, category_name AS name
      FROM asset_categories
      ORDER BY category_name
    `);
    return rows;
  }
}

module.exports = CategoryModel;
