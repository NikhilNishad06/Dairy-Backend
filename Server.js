const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth.routes');
const aboutRoutes = require('./routes/about.routes');
const contactRoutes = require('./routes/contact.routes');
const productRoutes = require('./routes/product.routes');
const paymentRoutes = require('./routes/payment.routes');

const app = express();

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://dairy-frontend-kohl.vercel.app'
];

app.use(cors({
<<<<<<< HEAD
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || origin.startsWith('http://localhost:')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
=======
  origin: 'https://dairy-frontend-kohl.vercel.app', // Your frontend URL
  credentials: true
>>>>>>> 4746ba5a2de6252a895691d585b4edfeeae44af7
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/products', productRoutes);
app.use('/api/payments', paymentRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Dairy Backend API' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});