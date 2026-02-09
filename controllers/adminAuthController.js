const adminModel = require('../models/adminModel');
const transporter = require('../config/nodemailer');
const bcrypt = require('bcrypt');
const logger = require('../config/logger');

const otpStore = new Map();

// helper
const sendJson = (res, status, payload) => res.status(status).json(payload);

exports.adminRegister = async (req, res, next) => {
  const { fullname, email, employeeId, position, password, location } = req.body;
  const avatar = req.file ? req.file.path : null;

  if (!fullname || !email || !employeeId || !password || !position || !location) {
    return sendJson(res, 400, { success: false, message: 'All fields are required' });
  }

  try {
    const existingAdmin = await adminModel.findByEmail(email);
    if (existingAdmin) {
      return sendJson(res, 400, { success: false, message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await adminModel.create({
      fullname,
      email,
      employeeId,
      location,
      position,
      password: hashedPassword,
      avatar,
    });

    return sendJson(res, 201, { success: true, message: 'Registered Successfully' });

  } catch (err) {
    logger.error("adminRegister failed", {
      error: err.message,
      stack: err.stack,
      email,
      employeeId
    });

    next(err); // send to global error handler
  }
};


exports.adminLogin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendJson(res, 400, { success: false, message: 'All fields required' });
  }

  try {
    const admin = await adminModel.findByEmail(email);

    // allow admin + superadmin
    if (!admin || (admin.role !== "admin" && admin.role !== "superadmin")) {
      return sendJson(res, 403, { success: false, message: "Access denied: Admins only" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return sendJson(res, 401, { success: false, message: 'Invalid credentials' });
    }

    // store temp session for OTP
    req.session.tempAdmin = {
      id: admin.id,
      email: admin.email,
      fullname: admin.fullname,
      avatar: admin.avatar,
      role: admin.role,
    };

    // generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email, otp);

    setTimeout(() => otpStore.delete(email), 5 * 60 * 1000);

    // send OTP email
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Your Admin Login OTP',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; padding: 30px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h2 style="color: #1f2937; font-size: 24px; margin-bottom: 20px;">Admin Panel Login OTP</h2>
            <p style="color: #4b5563; font-size: 16px; margin-bottom: 30px;">
              Hello <strong>${admin.fullname}</strong>,
            </p>
            <p>Use the following One-Time Password (OTP) to log in. This OTP is valid for <strong>5 minutes</strong>.</p>
            <div style="display: inline-block; padding: 15px 25px; font-size: 20px; font-weight: bold; color: #ffffff; background-color: #10b981; border-radius: 8px; letter-spacing: 2px;">
              ${otp}
            </div>
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              If you did not request this OTP, please ignore this email.
            </p>
          </div>
        </div>
      `
    });

    return sendJson(res, 200, { success: true, message: 'OTP sent to your email' });

  } catch (err) {
    logger.error("adminLogin failed", {
      error: err.message,
      stack: err.stack,
      email
    });

    next(err);
  }
};


exports.verifyOtp = async (req, res, next) => {
  const { email, otp } = req.body;
  const storedOtp = otpStore.get(email);

  if (!storedOtp) {
    return sendJson(res, 400, { success: false, message: 'OTP expired or invalid' });
  }

  if (storedOtp !== otp) {
    return sendJson(res, 400, { success: false, message: 'Invalid OTP' });
  }

  try {
    const tempAdmin = req.session.tempAdmin;

    if (!tempAdmin || tempAdmin.email !== email) {
      return sendJson(res, 400, { success: false, message: 'No login attempt found' });
    }

    req.session.admin = {
      id: tempAdmin.id,
      fullname: tempAdmin.fullname,
      email: tempAdmin.email,
      role: tempAdmin.role,
      avatar: tempAdmin.avatar
    };

    delete req.session.tempAdmin;
    otpStore.delete(email);

    req.session.save(() => {
      return sendJson(res, 200, { success: true, message: 'Login successful' });
    });

  } catch (err) {
    logger.error("verifyOtp failed", {
      error: err.message,
      stack: err.stack,
      email
    });

    next(err);
  }
};


exports.userLogin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendJson(res, 400, { success: false, message: 'All fields required' });
  }

  try {
    const user = await adminModel.findByUserEmail(email);

    if (!user || user.role !== "user") {
      return sendJson(res, 403, { success: false, message: "Access denied: Contact Administrator" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendJson(res, 401, { success: false, message: 'Invalid credentials' });
    }

    // store user in session
    req.session.user = {
      id: user.id,
      email: user.email,
      fullname: user.fullname,
      avatar: user.avatar,
      role: user.role,
      position: user.position,
      district_id: user.district_id,
      school_id: user.school_id,
      school_name: user.school_name
    };

    // return district & school status
    return sendJson(res, 200, {
      success: true,
      message: 'Welcome to ICT Inventory',
      user: {
        id: user.id,
        district_id: user.district_id,
        school_id: user.school_id
      }
    });

  } catch (err) {
    logger.error("userLogin failed", {
      error: err.message,
      stack: err.stack,
      email
    });

    next(err);
  }
};
