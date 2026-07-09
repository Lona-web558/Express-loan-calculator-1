const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const authRoutes = require('./auth');

const app = express();

// Serve only the specific static assets needed by the frontend.
// (Not using express.static(__dirname) here on purpose - since server.js,
// auth.js, package.json and users.json all live in this same folder, blanket
// static serving would let anyone download them, including user password hashes.)
app.get('/style.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'style.css'));
});

app.get('/calculator.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'calculator.js'));
});

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(session({
    secret: process.env.SESSION_SECRET || 'loanapp-dev-secret',
    resave:false,
    saveUninitialized:false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 2 // 2 hours
    }
}));


function isAuthenticated(req, res, next) {

    if (req.session.user) {
        return next();
    }

    res.redirect('/login');

}

function isGuest(req, res, next) {

    if (req.session.user) {
        return res.redirect('/dashboard');
    }

    next();

}

app.use('/auth',authRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/login', isGuest, (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/signup', isGuest, (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'));
});

app.get('/dashboard', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

app.get('/logout', (req, res) => {

    req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });

});

app.listen(process.env.PORT || 3000, ()=>{
    console.log("Server running http://localhost:3000");
});
