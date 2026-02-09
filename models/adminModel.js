const pool = require('../db/mysql');

class adminModel {
    static async findByEmail(email){
        const [rows] = await pool.query(
            'SELECT * FROM users where email = ? LIMIT 1',[email]
        );
        return rows[0];
    }

    static async findByUserEmail(email) {
    const [rows] = await pool.query(
        `SELECT u.id, u.emp_id, u.fullname, u.email, u.position, u.password, u.avatar, u.role, u.district_id, u.school_id, s.name AS school_name
        FROM users u
        LEFT JOIN schools s ON u.school_id = s.id
        WHERE u.email = ?
        LIMIT 1`,
        [email]
    );
    return rows[0];
    }

    static async create({fullname, employeeId, email, location, position, password, avatar}) {
        const [result] = await pool.query(
            'INSERT INTO users (emp_id, fullname, email, location, position, password, avatar, role, status) VALUES (?,?,?,?,?,?,?,?,?)',
            [employeeId, fullname, email, location, position, password, avatar, 'superadmin', 'active']
        );
        return {id: result.insertId, employeeId, email, fullname, position, location, role:'superadmin', status:'active'};
    }

}

module.exports = adminModel;
