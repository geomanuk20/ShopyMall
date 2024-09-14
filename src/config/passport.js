const GoogleStrategy = require('passport-google-oauth20').Strategy;
const collection = require('../configure');

module.exports = function(passport) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'
    }, async (accessToken, refreshToken, profile, done) => {
        console.log('Access Token:', accessToken);
        console.log('Profile:', profile);
        try {
            const newUser = {
                googleId: profile.id,
                Name: profile.displayName,
                email: profile.emails[0].value,
                profileImage: profile.photos[0].value,
            };
            
            // Check if a user with the same Google ID already exists
            let user = await collection.findOne({ googleId: profile.id });
            
            if (user) {
                // User with this Google ID exists, proceed
                done(null, user);
            } else {
                // Check if a user with the same email already exists
                user = await collection.findOne({ email: profile.emails[0].value });
                
                if (user) {
                    // If a user exists with the same email, update their Google ID
                    user.googleId = profile.id;
                    await user.save();
                    done(null, user);
                } else {
                    // No user with the same email, create a new user
                    user = await collection.create(newUser);
                    done(null, user);
                }
            }
        } catch (err) {
            console.error('Error:', err);
            done(err, null);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await collection.findById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
};
