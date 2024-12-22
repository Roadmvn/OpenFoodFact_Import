const { User } = require('../models');

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    
    console.log('👤 Tentative d\'inscription:', { email });

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      console.log('❌ Email déjà enregistré:', { email });
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Créer le nouvel utilisateur
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role: role || 'user'
    });

    // Générer le token
    const token = user.generateToken();

    console.log('✅ Inscription réussie:', { 
      id: user.id,
      email: user.email,
      role: user.role 
    });

    res.status(201).json({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('❌ Erreur lors de l\'inscription:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('🔐 Tentative de connexion:', { email });

    // Trouver l'utilisateur
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('❌ Utilisateur non trouvé:', { email });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Vérifier le mot de passe
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      console.log('❌ Mot de passe invalide:', { email });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Générer le token
    const token = user.generateToken();

    console.log('✅ Connexion réussie:', {
      id: user.id,
      email: user.email,
      role: user.role
    });

    res.json({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('❌ Erreur lors de la connexion:', error);
    res.status(500).json({ message: 'Error during login' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      console.log('❌ Profil non trouvé:', { id: req.user.id });
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('✅ Profil récupéré:', {
      id: user.id,
      email: user.email,
      role: user.role
    });

    res.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération du profil:', error);
    res.status(500).json({ message: 'Error retrieving profile' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      console.log('❌ Utilisateur non trouvé pour la mise à jour:', { id: req.user.id });
      return res.status(404).json({ message: 'User not found' });
    }

    const { firstName, lastName, email, password } = req.body;
    const updates = {
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(email && { email }),
      ...(password && { password })
    };

    await user.update(updates);
    
    console.log('✅ Profil mis à jour:', {
      id: user.id,
      email: user.email,
      role: user.role
    });

    res.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du profil:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      console.log('❌ Accès non autorisé à la liste des utilisateurs:', { role: req.user.role });
      return res.status(403).json({ message: 'Access denied' });
    }

    const users = await User.findAll({
      attributes: ['id', 'firstName', 'lastName', 'email', 'role']
    });
    
    console.log('✅ Liste des utilisateurs récupérée:', { count: users.length });
    res.json(users);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({ message: 'Error retrieving users' });
  }
};