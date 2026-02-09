const express = require('express');
const http = require('http');
const path = require("path");
const cors = require('cors');
const session = require('express-session');
const fs = require('fs');
const morgan = require("morgan");
const logger = require("./config/logger");

require('dotenv').config();

const app = express();
const server = http.createServer(app);

// create uploads folder if not exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(session({
    secret: 'ict-inventory-secret',
    resave: false,
    saveUninitialized: true
}));

// Static files
app.use('/user', express.static(path.join(__dirname, 'user')));
app.use('/admin', express.static(path.join(__dirname, 'admin')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Auth middleware
function requireUserLogin(req, res, next) {
  if (!req.session.user || req.session.user.role !== 'user') {
    return res.redirect('/user/pages/index.html');
  }
  next();
}

function requireAdminLogin(req, res, next) {
  if (!req.session.admin || (req.session.admin.role !== 'admin' && req.session.admin.role !== 'superadmin')) {
    return res.redirect('/admin/index.html');
  }
  next();
}

// API ROUTES
app.use('/api/admin', require('./routes/adminAuthRoutes'));
app.use('/api/admin', require('./routes/sessionRoutes'));
app.use('/api/admin', require('./routes/userManagementRoutes'));
app.use('/api/user', require('./routes/userAuthRoutes'));
app.use('/api/user', require('./routes/sessionRoutes'));
app.use('/api/asset', require('./routes/assetRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/personnel', require('./routes/personnelRoutes'));
app.use('/api/profile',require('./routes/profileRoutes'));
app.use("/api/records", require("./routes/recordsRoutes"));

// Home
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Admin
app.get('/admin/', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin/index.html'));
});

// User pages
const userValidPages = ['index', 'requestForm', 'personnel', 'profile', 'setup-profile', 'records'];

app.get('/user/pages/:page', requireUserLogin, (req, res) => {
  const page = req.params.page;
  if (!userValidPages.includes(page)) {
    return res.status(404).sendFile(path.join(__dirname, 'user/offline.html'));
  }
  res.sendFile(path.join(__dirname, `user/pages/${page}.html`));
});

// Admin pages
const adminValidPages = ['index', 'userManagement', 'formStack', 'transacion', 'report', 'profile'];

app.get('/admin/pages/:page', requireAdminLogin, (req, res) => {
  const page = req.params.page;
  if (!adminValidPages.includes(page)) {
    return res.status(404).sendFile(path.join(__dirname, 'admin/offline.html'));
  }
  res.sendFile(path.join(__dirname, `admin/pages/${page}.html`));
});

/* ====== ERROR HANDLER ====== */
app.use((err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    body: req.body,
  });

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`User app: http://localhost:${PORT}/user/`);
  logger.info(`Admin panel: http://localhost:${PORT}/admin/`);
});

/* ====== GLOBAL ERROR HANDLERS ====== */
process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection", reason);
});

process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception", err);
  process.exit(1);
});
