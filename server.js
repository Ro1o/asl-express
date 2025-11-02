// ----------------------------
// 🏫 After School Lessons API
// ----------------------------
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { MongoClient, ServerApiVersion } = require('mongodb');

// Middleware
const logger = require('./middleware/logger');

// Routes
const lessonsRouter = require('./routes/lessons');
const ordersRouter = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 8080;

// ------------------
// Middleware Section
// ------------------
app.use(cors());
app.use(express.json());
app.use(logger);

// ✅ Serve public folder from project root
app.use(express.static(path.join(__dirname, '..', 'public')));

// ✅ Images can be accessed via http://localhost:8080/images/art.jpg
app.use('/images', express.static(path.join(__dirname, '..', 'public/images')));

// ------------------
// Routes Section
// ------------------
app.use('/lessons', lessonsRouter);
app.use('/orders', ordersRouter);

// Root route
app.get('/', (req, res) => {
  res.send('🏫 After School Lessons API is running...');
});

// ------------------
// MongoDB Connection
// ------------------
const client = new MongoClient(process.env.MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function startServer() {
  try {
    await client.connect();
    console.log('✅ MongoDB connected successfully (Express Server)');

    const db = client.db(process.env.DB_NAME || 'AfterSchoolDB');
    app.locals.db = db;

    app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`🖼️  Test image: http://localhost:${PORT}/images/art.jpg`);
    });
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    process.exit(1);
  }
}

startServer();
