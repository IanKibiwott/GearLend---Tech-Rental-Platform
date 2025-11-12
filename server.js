const express = require('express');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');

const app = express();
const PORT = 5000;

console.log('?? Starting GearLend Server...');

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: 'IanK@37964026',
    database: 'gearlend'
});

db.connect((err) => {
    if (err) {
        console.log('? Database not connected - using sample data');
    } else {
        console.log('? MySQL Database Connected!');
        console.log('?? Database: gearlend');
        
        // Check current users
        db.execute('SELECT COUNT(*) as user_count FROM users', (err, results) => {
            if (!err) {
                console.log('?? Current users in database:', results[0].user_count);
            }
        });
    }
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set EJS
app.set('view engine', 'ejs');

// Sample data
const sampleGadgets = [
    { id: 1, name: 'Canon EOS R5', price: 49, category: 'Camera' },
    { id: 2, name: 'DJI Mavic 3 Pro', price: 79, category: 'Drone' },
    { id: 3, name: 'PlayStation 5', price: 35, category: 'Gaming' },
    { id: 4, name: 'Sony WH-1000XM5', price: 25, category: 'Audio' }
];

// Routes
app.get('/', (req, res) => {
    res.render('index', { title: 'GearLend - Rent Tech Gadgets' });
});

app.get('/gadgets', (req, res) => {
    res.render('gadgets', { title: 'Browse Gadgets - GearLend', gadgets: sampleGadgets });
});

app.get('/gadgets/:id', (req, res) => {
    const gadget = sampleGadgets.find(g => g.id === parseInt(req.params.id));
    if (!gadget) return res.status(404).send('Gadget not found');
    res.render('gadget-detail', { title: gadget.name + ' - GearLend', gadget: gadget });
});

app.get('/login', (req, res) => {
    res.render('login', { title: 'Login - GearLend' });
});

// Login - POST
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('?? Login attempt for:', email);
        
        db.execute('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
            if (err) {
                console.log('? Login database error:', err.message);
                return res.render('login', { title: 'Login - GearLend', error: 'Login failed' });
            }
            
            if (results.length === 0) {
                console.log('? Login failed: User not found -', email);
                return res.render('login', { title: 'Login - GearLend', error: 'Invalid email or password' });
            }
            
            const user = results[0];
            const isMatch = await bcrypt.compare(password, user.password);
            
            if (!isMatch) {
                console.log('? Login failed: Wrong password for -', email);
                return res.render('login', { title: 'Login - GearLend', error: 'Invalid email or password' });
            }
            
            console.log('? Login successful for:', user.name, '(', user.email, ')');
            res.render('dashboard', { 
                title: 'Dashboard - GearLend', 
                user: { name: user.name, email: user.email } 
            });
        });
    } catch (error) {
        console.log('? Login error:', error);
        res.render('login', { title: 'Login - GearLend', error: 'Login failed' });
    }
});

// Register - GET
app.get('/register', (req, res) => {
    res.render('register', { title: 'Register - GearLend' });
});

// Register - POST
app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log('?? Registration attempt:', name, email);
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        db.execute('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', 
        [name, email, hashedPassword], 
        (err, results) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    console.log('? Registration failed: Email already exists -', email);
                    return res.render('register', { title: 'Register - GearLend', error: 'Email already exists' });
                }
                console.log('? Registration database error:', err.message);
                return res.render('register', { title: 'Register - GearLend', error: 'Registration failed' });
            }
            
            console.log('? Registration successful for:', name, '(', email, ') - User ID:', results.insertId);
            
            // Auto-login after registration
            console.log('?? Auto-login after registration for:', email);
            res.render('dashboard', { 
                title: 'Dashboard - GearLend', 
                user: { name: name, email: email } 
            });
        });
    } catch (error) {
        console.log('? Registration error:', error);
        res.render('register', { title: 'Register - GearLend', error: 'Registration failed' });
    }
});

// Dashboard
app.get('/dashboard', (req, res) => {
    res.render('dashboard', { 
        title: 'Dashboard - GearLend', 
        user: { name: 'Guest', email: 'guest@example.com' } 
    });
});

// Database Info Page
app.get('/db-info', (req, res) => {
    db.execute('SELECT COUNT(*) as user_count FROM users', (err, results) => {
        if (err) {
            return res.json({ error: 'Database error' });
        }
        res.json({
            database: 'gearlend',
            total_users: results[0].user_count,
            status: 'connected'
        });
    });
});

// API Routes
app.get('/api/gadgets', (req, res) => {
    res.json(sampleGadgets);
});

app.listen(PORT, () => {
    console.log('? Server running on http://localhost:' + PORT);
    console.log('?? Database Info: http://localhost:' + PORT + '/db-info');
});
