# 🚀 GearLend - Tech Gadget Rental Platform

## 📖 Overview
GearLend is a full-stack eCommerce platform for renting high-end tech gadgets. Built with Node.js, Express, EJS, and MySQL.

## 🛠️ Tech Stack
- **Backend**: Node.js, Express.js, EJS Templates
- **Database**: MySQL with complex relational structures
- **Frontend**: HTML5, Tailwind CSS, JavaScript
- **Authentication**: JWT, bcryptjs
- **File Upload**: Multer

## 🗄️ Data Structures Implemented

### Database Structures
- **Users Table**: Array-like user objects with authentication
- **Gadgets Table**: Product catalog with JSON specifications
- **Rentals Table**: Transaction records with status enums
- **Categories Table**: Hierarchical product classification

### Application Structures
- **Arrays**: Collections (gadgets, users, rentals)
- **Objects**: Entity representations (user{}, gadget{})
- **JSON**: Complex nested data (specifications, availability)
- **Enums**: Restricted value sets (rental status, user roles)

## 🚀 Features
- User Authentication & Authorization
- Product Listing & Search
- Rental Booking System
- Shopping Cart Management
- Responsive EJS Templates
- Image Upload & Management

## 📦 Installation

1. **Clone Repository**
   
   git clone https://github.com/yourusername/gearlend-rentals.git
   cd gearlend-rentals/backend
   

2. **Install Dependencies**
 
   npm install
   

3. **Database Setup**
   - Create MySQL database 'gearlend'
   - Update .env with your credentials

4. **Run Application**
   
   npm run dev
  

5. **Access Application**
   - Frontend: http://localhost:5000
   - API: http://localhost:5000/api

## 🗂️ Project Structure

gearlend-rentals/
├── backend/
│   ├── views/           # EJS Templates
│   ├── public/          # Static assets
│   ├── src/            # Source code
│   ├── uploads/         # File storage
│   └── server.js       # Main application
├── README.md
└── .gitignore

## 🔗 API Endpoints
- \GET /api/gadgets\" - Fetch all gadgets
- \POST /api/auth/register\" - User registration
- \POST /api/rentals\" - Create rental order

## 📊 Data Flow
1. Client Request → Express Routes
2. Controllers → Business Logic
3. Models → Database Queries
4. EJS Templates → HTML Response

## 🤝 Contributing
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License
MIT License - see LICENSE file for details

## 👥 Authors
- Ian Kibiwott - Initial work

## 🙏 Acknowledgments
- Express.js team
- Tailwind CSS
- MySQL community
