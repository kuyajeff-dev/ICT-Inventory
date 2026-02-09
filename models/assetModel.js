const pool = require('../db/mysql');

class assetModel {
  static async createAsset(data) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // 1. Insert asset
      const [assetResult] = await conn.query(
        `INSERT INTO assets (
          user_id, property_no, old_property_no, serial_no, item_name,
          uom_id, brand_id, model, specs,
          acquisition_cost, acquisition_date, estimated_useful_life,
          category_id, classification_id,
          gl_sl, uacs
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.user_id,
          data.property_no,
          data.old_property_no || null,
          data.serial_no,
          data.item_name,
          data.uom_id,
          data.brand_id,
          data.model,
          data.specs,
          data.acquisition_cost,
          data.acquisition_date,
          data.estimated_useful_life,
          data.category_id,
          data.classification_id,
          data.gl_sl,
          data.uacs
        ]
      );

      const assetId = assetResult.insertId;

      // 2. DCP
      await conn.query(
        `INSERT INTO dcp_info (asset_id, is_non_dcp, dcp_package, dcp_year)
        VALUES (?, ?, ?, ?)`,
        [assetId, data.non_dcp, data.dcp_package, data.dcp_year]
      );

      // 3. Funding
      const [fundingResult] = await conn.query(
        `INSERT INTO funding_sources (
          mode_of_acquisition, source_of_acquisition, donor, source_of_funds,
          allotment_class, pmp_reference
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          data.mode_of_acquisition,
          data.source_of_acquisition,
          data.donor,
          data.source_of_funds,
          data.allotment_class,
          data.pmp_reference
        ]
      );

      await conn.query(
        `INSERT INTO asset_funding (asset_id, funding_source_id)
        VALUES (?, ?)`,
        [assetId, fundingResult.insertId]
      );

      // 4. Accountability
      await conn.query(
        `INSERT INTO asset_accountability (
          asset_id, transaction_type, accountable_officer,
          date_assigned_accountable, custodian_end_user, date_assigned_custodian,
          received_by, date_received
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          assetId,
          data.transaction_type,
          data.accountable_officer,
          data.date_assigned_accountable,
          data.custodian_end_user,
          data.date_assigned_custodian,
          data.received_by,
          data.date_received
        ]
      );

      // 5. Documents (FIXED KEYS)
      await conn.query(
        `INSERT INTO asset_documents (
          asset_id, document_type, document_no,
          document_type_two, document_no_two
        ) VALUES (?, ?, ?, ?, ?)`,
        [
          assetId,
          data.support_docs,
          data.document_no,     // <-- FIXED
          data.support_docs2,
          data.document_no_two  // <-- FIXED
        ]
      );

      // 6. Status
      await conn.query(
        `INSERT INTO asset_status (
          asset_id, under_warranty, end_of_warranty,
          non_functional, condition_id
        ) VALUES (?, ?, ?, ?, ?)`,
        [
          assetId,
          data.under_warranty,
          data.end_of_warranty,
          data.non_functional,
          data.condition_id
        ]
      );

      // 7. Location (FIXED)
      await conn.query(
        `INSERT INTO asset_location_history (
          asset_id, location_id, date_assigned
        ) VALUES (?, ?, now())`,
        [assetId, data.location_id]
      );

      // 8. Remarks
      await conn.query(
        `INSERT INTO asset_remarks (
          asset_id, accountability_status, remarks
        ) VALUES (?, ?, ?)`,
        [
          assetId,
          data.disposition,
          data.remarks
        ]
      );

      // 9. Supplier
      const [supplierResult] = await conn.query(
        `INSERT INTO suppliers (supplier_name) VALUES (?)`,
        [data.supplier_name]
      );

      await conn.query(
        `INSERT INTO asset_suppliers (asset_id, supplier_id)
        VALUES (?, ?)`,
        [assetId, supplierResult.insertId]
      );

      await conn.commit();
      return { id: assetId, ...data };

    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  static async createUserAsset(data) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // 1. Insert asset
      const [assetResult] = await conn.query(
        `INSERT INTO assets (
          user_id, property_no, old_property_no, serial_no, item_name,
          uom_id, brand_id, model, specs,
          acquisition_cost, acquisition_date, estimated_useful_life,
          category_id, classification_id,
          gl_sl, uacs
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.user_id,
          data.property_no,
          data.old_property_no || null,
          data.serial_no,
          data.item_name,
          data.uom_id,
          data.brand_id,
          data.model,
          data.specs,
          data.acquisition_cost,
          data.acquisition_date,
          data.estimated_useful_life,
          data.category_id,
          data.classification_id,
          data.gl_sl,
          data.uacs
        ]
      );

      const assetId = assetResult.insertId;

      // 2. DCP
      await conn.query(
        `INSERT INTO dcp_info (asset_id, is_non_dcp, dcp_package, dcp_year)
        VALUES (?, ?, ?, ?)`,
        [assetId, data.non_dcp, data.dcp_package, data.dcp_year]
      );

      // 3. Funding
      const [fundingResult] = await conn.query(
        `INSERT INTO funding_sources (
          mode_of_acquisition, source_of_acquisition, donor, source_of_funds,
          allotment_class, pmp_reference
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          data.mode_of_acquisition,
          data.source_of_acquisition,
          data.donor,
          data.source_of_funds,
          data.allotment_class,
          data.pmp_reference
        ]
      );

      await conn.query(
        `INSERT INTO asset_funding (asset_id, funding_source_id)
        VALUES (?, ?)`,
        [assetId, fundingResult.insertId]
      );

      // 4. Accountability
      await conn.query(
        `INSERT INTO asset_accountability (
          asset_id, transaction_type, accountable_officer,
          date_assigned_accountable, custodian_end_user, date_assigned_custodian,
          received_by, date_received
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          assetId,
          data.transaction_type,

          // NEW: Accept user OR personnel
          data.accountable_officer_user || data.accountable_officer_personnel || null,

          data.date_assigned_accountable,
          data.custodian_end_user,
          data.date_assigned_custodian,

          data.received_by_user || data.received_by_personnel || null,
          data.date_received
        ]
      );

      // 5. Documents
      await conn.query(
        `INSERT INTO asset_documents (
          asset_id, document_type, document_no,
          document_type_two, document_no_two
        ) VALUES (?, ?, ?, ?, ?)`,
        [
          assetId,
          data.support_docs,
          data.document_no,
          data.support_docs2,
          data.document_no_two
        ]
      );

      // 6. Status
      await conn.query(
        `INSERT INTO asset_status (
          asset_id, under_warranty, end_of_warranty,
          non_functional, condition_id
        ) VALUES (?, ?, ?, ?, ?)`,
        [
          assetId,
          data.under_warranty,
          data.end_of_warranty,
          data.non_functional,
          data.condition_id
        ]
      );

      // 7. Location
      await conn.query(
        `INSERT INTO asset_location_history (
          asset_id, location_id, date_assigned
        ) VALUES (?, ?, now())`,
        [assetId, data.location_id]
      );

      // 8. Remarks
      await conn.query(
        `INSERT INTO asset_remarks (
          asset_id, accountability_status, remarks
        ) VALUES (?, ?, ?)`,
        [assetId, data.disposition, data.remarks]
      );

      // 9. Supplier
      const [supplierResult] = await conn.query(
        `INSERT INTO suppliers (supplier_name) VALUES (?)`,
        [data.supplier_name]
      );

      await conn.query(
        `INSERT INTO asset_suppliers (asset_id, supplier_id)
        VALUES (?, ?)`,
        [assetId, supplierResult.insertId]
      );

      await conn.commit();
      return { id: assetId, ...data };

    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  static async getAssetsByUser(userId) {
    const [rows] = await pool.query(`
      SELECT
        a.property_no,
        a.old_property_no,
        a.serial_no,
        a.item_name,
        u.uom_name AS uom,
        b.brand_name AS brand,
        a.model,
        a.specs,

        d.is_non_dcp AS non_dcp,
        d.dcp_package,
        d.dcp_year,

        c.category_name AS category,
        cl.classification_name AS classification,
        a.gl_sl,
        a.uacs,

        a.acquisition_cost AS cost,
        NULLIF(a.acquisition_date, '0000-00-00') AS acquisition_date,
        a.estimated_useful_life AS useful_life,

        f.mode_of_acquisition AS mode,
        f.source_of_acquisition AS source,
        f.donor,
        f.source_of_funds,
        f.allotment_class,
        f.pmp_reference AS pmp_ref_no,

        doc.document_type AS documents,
        doc.document_no,
        doc.document_type_two AS documents_two,
        doc.document_no_two,

        acc.transaction_type,
        acc.accountable_officer,
        NULLIF(acc.date_assigned_accountable, '0000-00-00') AS date_assigned_accountable,
        acc.custodian_end_user,
        NULLIF(acc.date_assigned_custodian, '0000-00-00') AS date_assigned_custodian,
        acc.received_by,
        NULLIF(acc.date_received, '0000-00-00') AS accountability_date_received,

        ast.under_warranty,
        NULLIF(ast.end_of_warranty, '0000-00-00') AS end_of_warranty,
        ast.non_functional,
        ast.condition_id AS equipment_condition,

        loc.location_id AS location,

        rem.accountability_status AS status,
        rem.remarks,

        sup.supplier_name AS supplier

      FROM assets a
      LEFT JOIN units_of_measure u ON a.uom_id = u.id
      LEFT JOIN brands b ON a.brand_id = b.id
      LEFT JOIN categories c ON a.category_id = c.id
      LEFT JOIN asset_classifications cl ON a.classification_id = cl.id
      LEFT JOIN dcp_info d ON d.asset_id = a.id
      LEFT JOIN asset_funding af ON af.asset_id = a.id
      LEFT JOIN funding_sources f ON f.id = af.funding_source_id
      LEFT JOIN asset_documents doc ON doc.asset_id = a.id
      LEFT JOIN asset_accountability acc ON acc.asset_id = a.id
      LEFT JOIN asset_status ast ON ast.asset_id = a.id
      LEFT JOIN asset_location_history loc ON loc.asset_id = a.id
      LEFT JOIN asset_remarks rem ON rem.asset_id = a.id
      LEFT JOIN asset_suppliers asup ON asup.asset_id = a.id
      LEFT JOIN suppliers sup ON sup.id = asup.supplier_id
      WHERE a.user_id = ?
      ORDER BY a.id DESC
    `, [userId]);

    return rows;
  }

  static async getPersonnelByUser(userId) {
    const [rows] = await pool.query(`
      SELECT
        p.id,
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

  static async getAssetsByPersonnel(personnelId) {
    const [rows] = await pool.query(`
      SELECT
        a.property_no,
        a.item_name,
        b.brand_name AS brand,
        a.model,
        rem.accountability_status AS status,
        rem.remarks
      FROM assets a
      LEFT JOIN brands b ON b.id = a.brand_id
      LEFT JOIN asset_accountability acc ON acc.asset_id = a.id
      LEFT JOIN asset_remarks rem ON rem.asset_id = a.id
      LEFT JOIN personnel p ON p.id = ?
      WHERE
        acc.accountable_officer = p.full_name
        OR acc.custodian_end_user = p.full_name
        OR acc.received_by = p.full_name
      ORDER BY a.id DESC
    `, [personnelId]);

    return rows;
  }

  static async getAllAssets(status, userId) {
    let sql = `
      SELECT
        a.id,
        a.property_no AS propertyNo,
        a.item_name AS item,
        rem.accountability_status AS status,
        rem.remarks,
        st.condition_id AS \`condition\`,
        CONCAT(p.last_name, ', ', p.first_name) AS ownerName
      FROM assets a
      LEFT JOIN asset_remarks rem ON rem.asset_id = a.id
      LEFT JOIN asset_status st ON st.asset_id = a.id
      LEFT JOIN asset_accountability acc ON acc.asset_id = a.id
      LEFT JOIN personnel p ON (
          p.full_name = acc.accountable_officer
          OR p.full_name = acc.custodian_end_user
          OR p.full_name = acc.received_by
      )
      WHERE a.user_id = ?
    `;

    // ===== FILTER LOGIC =====
    if (status) {

      // 1) CONDITION FILTER
      const conditionFilters = ["serviceable", "unserviceable", "for repair", "not applicable"];

      // 2) REMARKS FILTER
      const remarkFilters = ["normal", "transfer", "stolen", "lost", "damaged due to calamity", "for disposal", "dispose", "donated"];

      // 3) ACCOUNTABILITY FILTER
      const accountabilityFilters = ["return", "transfer"];

      if (conditionFilters.includes(status)) {
        sql += " AND st.condition_id = ?";
      } else if (remarkFilters.includes(status)) {
        sql += " AND rem.accountability_status = ?";
      } else if (accountabilityFilters.includes(status)) {
        sql += " AND acc.received_by = ?";
      }

      const [rows] = await pool.query(sql, [userId, status]);
      return rows;
    }

    const [rows] = await pool.query(sql, [userId]);
    return rows;
  }

  static async updateAssetFull(assetId, transferTo, condition, status) {
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      await conn.query(
        `UPDATE asset_remarks
        SET accountability_status = ?
        WHERE asset_id = ?`,
        [status, assetId]
      );

      await conn.query(
        `UPDATE asset_status
        SET condition_id = ?
        WHERE asset_id = ?`,
        [condition, assetId]
      );
      // if return
      if (status === "transfer" && transferTo) {
        await conn.query(
          `UPDATE asset_accountability
          SET received_by = ?, date_received = CURDATE()
          WHERE asset_id = ?`,
          [transferTo, assetId]
        );
      }

      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  static async getAssetById(id) {
    const [rows] = await pool.query(`
      SELECT
        a.id,
        a.property_no AS propertyNo,
        a.item_name AS item,
        rem.accountability_status AS status,
        ast.condition_id AS assetCondition,
        rem.remarks,
        CONCAT(p.last_name, ', ', p.first_name) AS ownerName
      FROM assets a
      LEFT JOIN asset_remarks rem ON rem.asset_id = a.id
      LEFT JOIN asset_status ast ON ast.asset_id = a.id
      LEFT JOIN asset_accountability acc ON acc.asset_id = a.id
      LEFT JOIN personnel p ON (
        p.full_name = acc.accountable_officer
        OR p.full_name = acc.custodian_end_user
        OR p.full_name = acc.received_by
      )
      WHERE a.id = ?
    `, [id]);

    return rows[0];
  }

  static async getAssetSummary(userId) {
    const [rows] = await pool.query(`
      SELECT
        IFNULL(SUM(CASE WHEN acc.received_by IS NOT NULL AND acc.received_by <> '' THEN 1 ELSE 0 END), 0) AS returned,
        IFNULL(SUM(CASE WHEN rem.accountability_status = 'transfer' THEN 1 ELSE 0 END), 0) AS transfer,
        IFNULL(SUM(CASE WHEN st.condition_id = 'unserviceable' THEN 1 ELSE 0 END), 0) AS unserviceable
      FROM assets a
      LEFT JOIN asset_accountability acc ON acc.asset_id = a.id
      LEFT JOIN asset_remarks rem ON rem.asset_id = a.id
      LEFT JOIN asset_status st ON st.asset_id = a.id
      WHERE a.user_id = ?
    `, [userId]);

    return rows[0];
  }
}

module.exports = assetModel;
