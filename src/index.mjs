import "dotenv/config"; // ✅ must be first line before any other import
import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import { Strategy as LocalStrategy } from "passport-local";
import passport from "passport";
import routes from "./routes/router.mjs";
import { User } from "./mongoose/schema/user.mjs";
import mongoose from "mongoose";
import { comparePassword } from "./utils/helper.mjs";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

const app = express();

// ─── MongoDB Connection ───────────────────────────────────────────────────────
const MONGO_URI = "mongodb://semmozhi12122005_db_user:ZPMl9HZ2zEKlL6WI@ac-pqg5lcc-shard-00-00.3lhhot1.mongodb.net:27017,ac-pqg5lcc-shard-00-01.3lhhot1.mongodb.net:27017,ac-pqg5lcc-shard-00-02.3lhhot1.mongodb.net:27017/?ssl=true&replicaSet=atlas-968g02-shard-0&authSource=admin&appName=Cluster0";

mongoose
    .connect(MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(express.json());
app.use(cookieParser("yatch yatch"));
app.use(
    session({
        secret: "private gateway",
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: 60000 * 60,
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());

// ─── Local Strategy ───────────────────────────────────────────────────────────
passport.use(
    new LocalStrategy(
        { usernameField: "user_name", passwordField: "password" },
        async (user_name, password, done) => {
            try {
                console.log("Authenticating user:", user_name);
                const user = await User.findOne({ user_name }); // ✅ fetch from MongoDB
                if (!user) {
                    return done(null, false, { message: "Invalid username" });
                }
                if (comparePassword(password, user.password) === false) {
                    return done(null, false, { message: "Incorrect password" });
                }
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    )
);

// ─── Google Strategy ──────────────────────────────────────────────────────────
passport.use(new GoogleStrategy(
    {
        clientID:process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:  process.env.GOOGLE_CALLBACK_URL,
        proxy:        true, // ✅ FIX: add proxy option for correct callback URL handling
    },
    async (accessToken, refreshToken, profile, done) => { // ✅ FIX 1: must be async
        try {
            let user = await User.findOne({ googleId: profile.id }); // ✅ FIX 2: was missing await

            if (!user) {
                user = new User({                                     // ✅ FIX 3: reuse variable,
                    googleId:  profile.id,                            //    removed unreachable code
                    email:     profile.emails?.[0]?.value || null,
                    user_name: profile.displayName,
                });
                await user.save();                                    // ✅ FIX 4: was missing await
            }

            return done(null, user);                                  // ✅ FIX 5: moved outside if block
                                                                      //    so existing users are returned too
        } catch (err) {
            return done(err, null);
        }
    }
));

// ─── Serialize / Deserialize ──────────────────────────────────────────────────
passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user || false);
    } catch (err) {
        done(err, false);
    }
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
    res.cookie("user", "Admin", { maxAge: 60000 * 60, signed: true });
    console.log("Session ID:", req.session.id);
    res.send({ msg: "Root" });
});

app.get("/login", (req, res) => {
    res.send(`
        <form method="POST" action="/login">
            <input type="text"     name="user_name" placeholder="Username" /><br/>
            <input type="password" name="password"  placeholder="Password" /><br/>
            <button type="submit">Login</button>
        </form>
        <a href="/auth/google">Login with Google</a>
    `);
});

app.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            return res.status(401).json({
                message: info?.message || "Login failed",
            });
        }
        req.logIn(user, (err) => {
            if (err) return next(err);
            return res.json({ message: "Login successful", user });
        });
    })(req, res, next);
});

app.get("/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get("/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" ,
        KeepSessionInfo: true, // ✅ FIX: ensure session is maintained after Google auth
    }),
    (req, res) => {
        res.json({ message: "Google authentication successful", user: req.user });
    }
);

app.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.json({ message: "Logged out successfully" });
    });
});

app.use(routes);

// ─── Server ───────────────────────────────────────────────────────────────────
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ App is listening on port ${PORT}`);
});
