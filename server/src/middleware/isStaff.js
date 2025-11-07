const isStaff = (req, res, next) => {
  if (req.user && (req.user.role === 'staff' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ error: 'Access denied. Staff only.' });
  }
};

module.exports = { isStaff };
