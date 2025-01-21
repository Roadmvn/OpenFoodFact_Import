const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  // Si l'utilisateur est déjà authentifié via session
  if (req.isAuthenticated()) {
    return next();
  }

  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate.' });
  }
};

const checkRole = (roles) => {
  return (req, res, next) => {
    // Vérifier si l'utilisateur est authentifié (via session ou JWT)
    if (!req.isAuthenticated() && !req.user) {
      return res.status(401).json({ message: 'Please authenticate.' });
    }

    // Obtenir le rôle de l'utilisateur (session ou JWT)
    const userRole = req.user.role;

    if (!roles.includes(userRole)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }

    next();
  };
};

// Middleware pour vérifier si l'utilisateur est admin
const isAdmin = (req, res, next) => {
  if (!req.isAuthenticated() && !req.user) {
    return res.status(401).json({ message: 'Please authenticate.' });
  }

  const userRole = req.user.role;

  if (userRole !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }

  next();
};

// Middleware pour vérifier si l'utilisateur est connecté
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated() || req.user) {
    return next();
  }
  res.status(401).json({ message: 'Please authenticate.' });
};

module.exports = {
  auth,
  checkRole,
  isAdmin,
  isAuthenticated
};