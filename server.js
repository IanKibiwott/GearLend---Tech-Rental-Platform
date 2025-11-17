const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const PORT = 5000;

console.log('Starting GearLend Server...');

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'IanK@37964026',
    database: 'gearlend'
});

db.connect((err) => {
    if (err) {
        console.log('Database not connected - using sample data');
    } else {
        console.log('MySQL Database Connected!');
    }
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Set EJS
app.set('view engine', 'ejs');
app.set('views', 'views');

// Sample data
const sampleGadgets = [
    { id: 1, name: 'Canon EOS R5', price: 49, category: 'Camera' },
    { id: 2, name: 'DJI Mavic 3 Pro', price: 79, category: 'Drone' },
    { id: 3, name: 'PlayStation 5', price: 35, category: 'Gaming' },
    { id: 4, name: 'Sony WH-1000XM5', price: 25, category: 'Audio' }
];

// Routes
app.get('/', (req, res) => {
    res.render('index', { title: 'GearLend' });
});

app.get('/gadgets', (req, res) => {
    res.render('gadgets', { title: 'Gadgets', gadgets: sampleGadgets });
});

app.get('/gadgets/:id', (req, res) => {
    const gadget = sampleGadgets.find(g => g.id === parseInt(req.params.id));
    if (!gadget) return res.status(404).send('Not found');
    res.render('gadget-detail', { title: gadget.name, gadget: gadget });
});

app.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        db.execute('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
            if (err) throw err;
            
            if (results.length === 0) {
                return res.render('login', { title: 'Login', error: 'Invalid credentials' });
            }
            
            const user = results[0];
            const isMatch = await bcrypt.compare(password, user.password);
            
            if (!isMatch) {
                return res.render('login', { title: 'Login', error: 'Invalid credentials' });
            }
            
            res.render('dashboard', { title: 'Dashboard', user: { name: user.name, email: user.email } });
        });
    } catch (error) {
        res.render('login', { title: 'Login', error: 'Login failed' });
    }
});

app.get('/register', (req, res) => {
    res.render('register', { title: 'Register' });
});

app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        db.execute('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword], (err, results) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.render('register', { title: 'Register', error: 'Email exists' });
                }
                throw err;
            }
            res.render('login', { title: 'Login', success: 'Registration successful!' });
        });
    } catch (error) {
        res.render('register', { title: 'Register', error: 'Registration failed' });
    }
});

app.get('/dashboard', (req, res) => {
    res.render('dashboard', { title: 'Dashboard', user: { name: 'User', email: 'user@example.com' } });
});

app.get('/api/gadgets', (req, res) => {
    res.json(sampleGadgets);
});

app.listen(PORT, () => {
    console.log('Server running on http://localhost:' + PORT);
});