const pool = require("../db/mysql");

class Personnel {
  static async createPersonnelWithDetails(data) {
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      const [personnelResult] = await conn.query(
        `
        INSERT INTO personnel
        (employee_id, user_id, last_name, first_name, middle_name, suffix, full_name, date_hired)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          data.empId,
          data.userId,
          data.lastName,
          data.firstName,
          data.middleName,
          data.suffix,
          data.fullName,
          data.dateHired
        ]
      );

      const personnelId = personnelResult.insertId;

      await conn.query(
        `
        INSERT INTO personnel_contact
        (personnel_id, mobile_no, deped_email, personal_email)
        VALUES (?, ?, ?, ?)
        `,
        [
          personnelId,
          data.mobileNo,
          data.depedEmail,
          data.personalEmail
        ]
      );

      await conn.query(
        `
        INSERT INTO personnel_office
        (personnel_id, sdo_office, position, officer_in_charge, oic_designation)
        VALUES (?, ?, ?, ?, ?)
        `,
        [
          personnelId,
          data.sdoOffice,
          data.position,
          data.oic,
          data.oicDesignation
        ]
      );

      await conn.commit();
      return personnelId;

    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  static async getPersonnelByUser(userId) {
    const [rows] = await pool.query(`
      SELECT
        p.id,  -- ✅ ADD COMMA HERE
        p.employee_id,
        p.last_name,
        p.first_name,
        p.middle_name,
        p.suffix,
        CONCAT(
          IFNULL(p.last_name, ''), 
          IF(p.last_name IS NOT NULL AND p.last_name <> '', ',', ''),
          ' ',
          IFNULL(p.first_name, ''),
          ' ',
          IFNULL(p.middle_name, ''),
          ' ',
          IFNULL(p.suffix, '')
        ) AS full_name,
        DATE_FORMAT(p.date_hired, '%Y-%m-%d') AS date_hired,
        o.sdo_office,
        o.position,
        o.officer_in_charge,
        o.oic_designation,
        c.mobile_no,
        c.deped_email,
        c.personal_email
      FROM personnel p
      LEFT JOIN personnel_office o ON o.personnel_id = p.id
      LEFT JOIN personnel_contact c ON c.personnel_id = p.id
      WHERE p.user_id = ?
      ORDER BY p.id DESC
    `, [userId]);

    return rows;
  }

  static async getPersonnel(userId) {
    const [rows] = await pool.query(
      `
      SELECT 
        p.id,
        p.employee_id,
        p.last_name,
        p.first_name,
        p.middle_name,
        p.suffix,
        CONCAT(
          IFNULL(p.last_name, ''),
          IF(p.last_name IS NOT NULL AND p.last_name <> '', ', ', ''),
          IFNULL(p.first_name, ''),
          IF(p.middle_name IS NOT NULL AND p.middle_name <> '', ' ', ''),
          IFNULL(p.middle_name, ''),
          IF(p.suffix IS NOT NULL AND p.suffix <> '', ' ', ''),
          IFNULL(p.suffix, '')
        ) AS full_name,
        u.fullname AS added_by
      FROM personnel p
      JOIN users u ON u.id = p.user_id
      WHERE p.user_id = ?
      `,
      [userId]
    );

    return rows;
  }

  static async getPersonnelById(personnelId) {
  const [rows] = await pool.query(`
    SELECT
      p.id,
      p.employee_id,
      p.last_name,
      p.first_name,
      p.middle_name,
      p.suffix,
      p.full_name,
      DATE_FORMAT(p.date_hired, '%Y-%m-%d') AS date_hired,
      o.sdo_office,
      o.position,
      o.officer_in_charge,
      o.oic_designation,
      c.mobile_no,
      c.deped_email,
      c.personal_email
    FROM personnel p
    LEFT JOIN personnel_office o ON o.personnel_id = p.id
    LEFT JOIN personnel_contact c ON c.personnel_id = p.id
    WHERE p.id = ?
  `, [personnelId]);

  return rows[0]; // return one record
}

  static async getAllPersonnel(status, userId) {
    let sql = `
      SELECT
        p.id,
        p.employee_id AS empId,
        CONCAT(p.last_name, ', ', p.first_name) AS name,
        rem.status
      FROM personnel p
      LEFT JOIN personnel_status rem ON rem.personnel_id = p.id
      WHERE p.user_id = ?
    `;

    if (status) {
      sql += " AND rem.status = ?";
      const [rows] = await pool.query(sql, [userId, status]);
      return rows;
    }

    const [rows] = await pool.query(sql, [userId]);
    return rows;
  }

  static async updatePersonnel(id, status) {
    await pool.query(
      `
      INSERT INTO personnel_status (personnel_id, status)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE status = VALUES(status)
      `,
      [id, status]
    );
  }
}

module.exports = Personnel;
