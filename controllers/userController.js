const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');

exports.getUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

exports.addUser = async (req, res) => {
  try {
    const { employeeId, fullname, email, location, password, role, position, status } = req.body;

    if (!employeeId || !fullname || !email || !password || !location) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // ✅ CHECK DUPLICATES
    const existingUser = await userModel.findByEmployeeIdOrName(employeeId, fullname);

    if (existingUser) {
      return res.status(409).json({
        message:
          existingUser.employeeId === employeeId
            ? 'Employee ID already exists'
            : 'Employee name already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const avatar = req.file ? req.file.filename : null;

    await userModel.createUser({
      employeeId,
      fullname,
      email,
      password: hashedPassword,
      location,
      role: role || 'user',
      position,
      status: status || 'active',
      avatar
    });

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add user' });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const updated = await userModel.updateStatus(employeeId, status);

    if (!updated) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ success: true, message: 'Status updated' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update status' });
  }
};

exports.getDistricts = async (req, res, next) => {
  try {
    const districts = await userModel.getAllDistricts();
    return res.status(200).json(districts);
  } catch (err) {
    next(err);
  }
};

exports.getSchoolsByDistrict = async (req, res, next) => {
  const districtId = req.query.district_id;

  if (!districtId) {
    return res.status(400).json({ success: false, message: 'district_id is required' });
  }

  try {
    const schools = await userModel.getSchoolsByDistrict(districtId);
    return res.status(200).json(schools);
  } catch (err) {
    next(err);
  }
};

exports.updateLocation = async (req, res) => {
  const { district_id, school_id, user_id } = req.body;

  if (!district_id || !school_id || !user_id) {
    return res.status(400).json({
      success: false,
      message: 'Missing fields'
    });
  }

  try {
    await userModel.updateLocation(user_id, district_id, school_id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
