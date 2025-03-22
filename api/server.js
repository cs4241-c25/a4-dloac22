require("dotenv").config();
const express = require("express"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    session = require("express-session"),
    LocalStrategy = require("passport-local").Strategy,
    GitHubStrategy = require("passport-github2").Strategy,
    bodyParser = require("body-parser");

const path = require("path");
const app = express();
app.use(express.static(path.join(__dirname, "../build")));
const PORT = process.env.PORT || 3000;

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const UserSchema = new mongoose.Schema({
    username: String,
    githubId: String,
    password: String,
});

const PracticeSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    practiceType: String,
    duration: Number,
    score: Number,
    date: String,
});

const User = mongoose.model("User", UserSchema);
const Practice = mongoose.model("Practice", PracticeSchema);

// Middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: 'lax'
    },
    proxy: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());

// Content Security Policy
app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', 'default-src \'self\'');
    next();
});

// GitHub Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.VERCEL_URL ?
        `https://a4-dattheloac.vercel.app/auth/github/callback` :
        "http://localhost:3000/auth/github/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ githubId: profile.id });

      if (!user) {
        user = new User({
          githubId: profile.id,
          username: profile.username
        });
        await user.save();
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

// GitHub Authentication Routes
app.get('/api/auth/github',
    passport.authenticate('github', { scope: ['user:email'] })
);

app.get('/api/auth/github/callback',
    passport.authenticate('github', {
      failureRedirect: '/'
    }),
    function (req, res) {
        res.redirect('/InputSection');
    }
);

// Passport strategy
passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const user = await User.findOne({ username: username });
        // If the user is not found, return an error message
        if (!user) {
            return done(null, false, { message: "User not found" });
        }

        // If the password does not match, return an error message
        if (user.password !== password) {
            return done(null, false, { message: "Incorrect password" });
        }
        // Default case: return the user object
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

// Serialization methods
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

// Login route
app.post("/api/login", (req, res, next) => {
    console.log('Login attempt:', req.body);
    
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error('Login authentication error:', err);
            return res.status(500).json({ message: "Authentication error" });
        }
        
        if (!user) {
            console.log('Login failed:', info);
            return res.status(401).json({ message: info.message || "Authentication failed" });
        }
        
        req.login(user, (loginErr) => {
            if (loginErr) {
                console.error('Login session error:', loginErr);
                return res.status(500).json({ message: "Session creation failed" });
            }
            
            console.log('Login successful:', user);
            res.json({ 
                success: true, 
                user: { username: user.username, id: user._id } 
            });
        });
    })(req, res, next);
});


// Signup route
app.post("/api/signup", async (req, res) => {
    console.error('Full signup request:', {
        body: req.body,
        headers: req.headers,
        env: {
            MONGO_URI: process.env.MONGO_URI ? 'configured' : 'missing',
            NODE_ENV: process.env.NODE_ENV
        }
    });
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const newUser = new User({ username, password });
        await newUser.save();
        console.log('User created successfully:', username);

        res.json({ success: true, message: "User created successfully" });
    } catch (err) {
        console.error('Signup Catch Block Error:', err);
        res.status(500).json({
            message: "Signup error",
            details: err.toString(),
            stack: err.stack
        });
    }
});

// Data route
app.get("/api/data", async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
    }

    try {
        const userId = req.user._id || req.user.id;
        const data = await Practice.find({ userId });
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Error retrieving data" });
    }
});

// Add practice data
app.post("/api/add", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");

    try {
        const newPractice = new Practice({ ...req.body, userId: req.user.id });
        await newPractice.save();
        res.json(newPractice);
    } catch (err) {
        res.status(500).send("Error adding practice data");
    }
});

// Update practice data
app.put("/api/update/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");

    try {
        // Find the practice data entry
        const updatedPractice = await Practice.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }  // Returns the updated document
        );
        // If the entry was not found, return a 404 status
        if (!updatedPractice) {
            return res.status(404).send("Entry not found");
        }
        // Return the updated document as JSON
        res.json(updatedPractice);
    } catch (err) {
        // If there is an error, return a 500 status with an error message
        res.status(500).send("Error updating entry");
    }
});

// Delete practice data
app.delete("/api/delete/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");

    try {
        await Practice.findByIdAndDelete(req.params.id);
        res.send("Entry deleted");
    } catch (err) {
        res.status(500).send("Error deleting entry");
    }
});

// Logout route
app.get("/api/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: "Error logging out" });
        }
        res.json({ message: "Logged out successfully" });
    });
});

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
