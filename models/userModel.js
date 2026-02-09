const pool = require('../db/mysql');

class UserModel {

  static async getAllUsers() {
    const [rows] = await pool.query(
      'SELECT id, emp_id AS employeeId, fullname, email, location, role, status, avatar FROM users'
    );
    return rows;
  }
  static async createUser(user) {
    const {
      employeeId,
      fullname,
      email,
      password,
      location,
      role,
      position,
      status,
      avatar
    } = user;

    await pool.query(
      `INSERT INTO users 
      (emp_id, fullname, email, password, location, role, position, status, avatar)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)`,
      [employeeId, fullname, email, password, location, role, position, status, avatar]
    );
  }
  static async updateStatus(employeeId, status) {
    const [result] = await pool.query(
      'UPDATE users SET status = ? WHERE emp_id = ?',
      [status, employeeId]
    );

    return result.affectedRows > 0;
  }
  static async findByEmployeeIdOrName(employeeId, fullname) {
    const [rows] = await pool.query(
      `SELECT emp_id AS employeeId, fullname
      FROM users
      WHERE emp_id = ? OR LOWER(fullname) = LOWER(?)`,
      [employeeId, fullname]
    );

    return rows[0];
  }
  static async getActiveUser () {
    const [rows] = await pool.query(
      "SELECT id, emp_id, fullname FROM users WHERE status = 'active'"
    );
    return rows;
  }
  static async getById(id) {
    const [rows] = await pool.query(
      `SELECT id, fullname, email, role FROM users WHERE id = ?`,
      [id]
    );
    return rows[0];
  }
  static async getAllDistricts() {
    const [rows] = await pool.query(
      `SELECT id, name FROM districts ORDER BY name`
    );
    return rows;
  }
  static async getSchoolsByDistrict(districtId) {
    const [rows] = await pool.query(
      `SELECT id, name 
       FROM schools 
       WHERE district_id = ? 
       ORDER BY name`,
      [districtId]
    );
    return rows;
  }
  static async updateLocation(userId, districtId, schoolId) {
    await pool.query(
      `UPDATE users SET district_id = ?, school_id = ? WHERE id = ?`,
      [districtId, schoolId, userId]
    );
  }
}

module.exports = UserModel;
