const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { localPool } = require('./database');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const [rows] = await localPool.execute(
            'SELECT * FROM users WHERE id = ?',
            [id]
        );
        done(null, rows[0]);
    } catch (error) {
        done(error, null);
    }
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Vérifier si l'utilisateur existe déjà
        const [existingUsers] = await localPool.execute(
            'SELECT * FROM users WHERE google_id = ?',
            [profile.id]
        );

        if (existingUsers.length) {
            return done(null, existingUsers[0]);
        }

        // Créer un nouvel utilisateur
        const [result] = await localPool.execute(
            'INSERT INTO users (google_id, email, name, role) VALUES (?, ?, ?, ?)',
            [profile.id, profile.emails[0].value, profile.displayName, 'acheteur']
        );

        const [newUser] = await localPool.execute(
            'SELECT * FROM users WHERE id = ?',
            [result.insertId]
        );

        done(null, newUser[0]);
    } catch (error) {
        done(error, null);
    }
}));

module.exports = passport;
