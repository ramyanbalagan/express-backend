const express = require('express');
const app = express();
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const User = require('./models/LoginModel')

require('dotenv').config();
app.use(cors())
app.use(express.json())

// Session setup
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
}));

app.set('view engine', 'ejs');
app.use(express.static('public'));

const mongoDB = process.env.MONGO_DB

const mongooseConnect = async () => {
    try {
        await mongoose.connect(mongoDB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('connected to database');
    } catch (error) {
        console.log(error);
    }
}

mongooseConnect();

app.listen(8080, (req, res) => {
    console.log('backend server connected');
})

// Register view
app.get('/register', (req, res) => {
    res.render('register');
});

// login view
app.get('/login', (req, res) => {
    res.render('login');
});

// Register new user
app.post('/register', async (req, res) => {
    console.log(req.body); // Add this to check the incoming data

    const { username, password, phone, email, profession } = req.body;

    if (!password) {
        return res.status(400).json({ message: 'Password is required.', success: false });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword, phone, email, profession });
        await newUser.save();
        req.session.userId = newUser._id;
        res.status(200).json({ message: "Success Registration", success: true })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error registering user', success: false });
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.', success: false });
    }

    try {
        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'User not found.', success: false });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.', success: false });
        }

        // If login is successful, set session and redirect
        req.session.userId = user._id;
        res.status(200).json({ message: "Success login", success: true })
        //   res.redirect('/dashboard');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error logging in.', success: false });
    }
});

// Dashboard Route
app.get('/dashboard', async (req, res) => {
    if (!req.session.userId) return res.redirect('/login');

    const users = await User.find({ _id: { $ne: req.session.userId } }); // exclude own user
    res.render('dashboard', { users });
});

// CRUD Operations for Users
app.get('/edit/:id', async (req, res) => {
    if (!req?.session?.userId) return res.redirect('/login');

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('User not found');

    res.render('edit', { user });
});

// Edit existing user
app.post('/edit/:id', async (req, res) => {
    if (!req.session.userId) return res.redirect('/login');
    console.log(req.body)
    const { username, phone, email, profession } = req.body;
    await User.findByIdAndUpdate(req.params.id, { username, phone, email, profession });
    res.status(200).json({ message: "Success Update", success: true })
});

// Delete existing user
app.get('/delete/:id', async (req, res) => {
    if (!req?.session?.userId) return res.redirect('/login');

    await User.findByIdAndDelete(req.params.id);
    res.redirect('/dashboard');
});
