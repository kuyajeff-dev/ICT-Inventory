const path = require('path');

exports.getAdminSession = (req, res) => {
  const admin = req.session.admin;
  const tempAdmin = req.session.tempAdmin;

  if (!admin && !tempAdmin) {
    return res.status(401).json({ message: 'Not logged in' });
  }

  if (tempAdmin && !admin) {
    return res.json({
      pendingAdmin: true,
      id: tempAdmin.id,
      fullname: tempAdmin.fullname,
      email: tempAdmin.email,
      role: tempAdmin.role,
      avatar: tempAdmin.avatar
        ? path.basename(tempAdmin.avatar)
        : null
    });
  }

  return res.json({
    id: admin.id,
    fullname: admin.fullname,
    email: admin.email,
    role: admin.role || 'admin',
    avatar: admin.avatar
      ? path.basename(admin.avatar)
      : null
  });
};

exports.getUserSession = (req, res) => {
  const user = req.session.user || req.session.tempUser;

  if (!user) {
    return res.status(401).json({ message: 'Not logged in' });
  }

  if (!req.session.user && req.session.tempUser) {
    req.session.user = req.session.tempUser;
    delete req.session.tempUser;
  }

  return res.json({
    id: user.id,
    fullname: user.fullname,
    email: user.email,
    position: user.position,
    role: user.role || 'user',
    office: user.school_name || 'Unknown Office',
    avatar: user.avatar ? path.basename(user.avatar) : null
  });
}

exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.clearCookie('connect.sid'); // important
    return res.json({ message: 'Logged out successfully' });
  });
};
