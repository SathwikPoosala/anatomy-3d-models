const authMiddleware = (req, res, next) => {
  if (req.session && req.session.userId) {
    req.userId = req.session.userId;
    req.userRole = req.session.userRole;
    next();
  } else {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

const teacherMiddleware = (req, res, next) => {
  if (req.session && req.session.userRole === 'teacher') {
    next();
  } else {
    return res.status(403).json({ message: 'Forbidden: Teacher access required' });
  }
};

const studentMiddleware = (req, res, next) => {
  if (req.session && req.session.userRole === 'student') {
    next();
  } else {
    return res.status(403).json({ message: 'Forbidden: Student access required' });
  }
};

module.exports = { authMiddleware, teacherMiddleware, studentMiddleware };

