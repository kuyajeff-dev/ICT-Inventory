const pool = require('../db/mysql');

class BrandModel {
  static async getAll() {
    const [rows] = await pool.query(`
      SELECT id, brand_name AS name
      FROM brands
      ORDER BY brand_name
    `);
    return rows;
  }
}

module.exports = BrandModel;
