const personnelModel = require("../models/personnelModel");
const logger = require("../config/logger");

const PERSONAL_EMAIL_REGEX =
  /^[A-Za-z0-9._%+-]+@(gmail\.com|yahoo\.com|deped\.gov\.ph)$/;

exports.addPersonnel = async (req, res, next) => {
  try {
    const userId = req.session.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const {
      empId,
      lastName,
      firstName,
      middleName,
      suffix,
      sdoOffice,
      position,
      oic,
      oicDesignation,
      mobileNo,
      depedEmail,
      personalEmail,
      dateHired
    } = req.body;

    // ---- BASIC VALIDATION ----
    if (!empId || !lastName || !firstName || !position) {
      return res.status(400).json({
        success: false,
        message: "Employee ID, Last Name, First Name and Position are required"
      });
    }

    // ---- EMAIL VALIDATION ----
    if (depedEmail && !depedEmail.endsWith("@deped.gov.ph")) {
      return res.status(400).json({
        success: false,
        message: "DepEd email must end with @deped.gov.ph"
      });
    }

    if (personalEmail && !PERSONAL_EMAIL_REGEX.test(personalEmail)) {
      return res.status(400).json({
        success: false,
        message:
          "Personal email must be gmail.com, yahoo.com, or deped.gov.ph"
      });
    }

    const fullName = `${lastName}, ${firstName} ${middleName || ""} ${suffix || ""}`
      .replace(/\s+/g, " ")
      .trim();

    await personnelModel.createPersonnelWithDetails({
      userId,
      empId,
      lastName,
      firstName,
      middleName,
      suffix,
      fullName,
      sdoOffice,
      position,
      oic: oic ? 1 : 0,
      oicDesignation,
      mobileNo,
      depedEmail,
      personalEmail,
      dateHired
    });

    logger.info("Personnel created", { empId, userId });

    res.json({
      success: true,
      message: "Personnel saved successfully"
    });

  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      logger.warn("Duplicate employee_id", { empId: req.body.empId });
      return res.status(409).json({
        success: false,
        message: "Employee ID already exists"
      });
    }

    logger.error("Add personnel failed", {
      error: err.message,
      stack: err.stack
    });

    next(err);
  }
};
