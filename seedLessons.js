// ----------------------------
// 🌱 Seed Lessons for After School Lessons API
// ----------------------------
require('dotenv').config({ path: './.env' });
const { MongoClient } = require('mongodb');
const os = require('os');

// 🧠 Detect local IP (for testing)
function getLocalIP() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal && net.address.startsWith('192.')) {
        return net.address;
      }
    }
  }
  return 'localhost';
}

// 🌍 Automatically detect environment
const IS_RENDER = process.env.RENDER === 'true' || process.env.NODE_ENV === 'production';
const LOCAL_IP = getLocalIP();

// ✅ Use Render URL in production, localhost otherwise
const BASE_URL = IS_RENDER
  ? 'https://asl-express.onrender.com'
  : `http://localhost:8080`;

console.log(`🌍 Using BASE_URL = ${BASE_URL}`);

// 🧩 Lessons Data
const lessons = [
  { topic: 'Mathematics', teacher: 'Mr. Patel', location: 'Hendon', price: 100, space: 5, icon: '📐', image: `${BASE_URL}/images/maths.jpg` },
  { topic: 'Cybersecurity', teacher: 'Dr. Lee', location: 'Colindale', price: 95, space: 5, icon: '🔬', image: `${BASE_URL}/images/cyber.jpg` },
  { topic: 'English', teacher: 'Ms. Brown', location: 'Brent Cross', price: 90, space: 5, icon: '📚', image: `${BASE_URL}/images/eng.jpg` },
  { topic: 'LLB', teacher: 'Mr. Carter', location: 'Golders Green', price: 85, space: 5, icon: '🏛️', image: `${BASE_URL}/images/law.jpg` },
  { topic: 'Geography', teacher: 'Ms. Parker', location: 'Hendon', price: 88, space: 5, icon: '🗺️', image: `${BASE_URL}/images/geography.jpg` },
  { topic: 'Artificial Intelligence', teacher: 'Mr. Singh', location: 'Colindale', price: 120, space: 5, icon: '💻', image: `${BASE_URL}/images/ai.jpg` },
  { topic: 'Art', teacher: 'Ms. Torres', location: 'Brent Cross', price: 75, space: 5, icon: '🎨', image: `${BASE_URL}/images/art.jpg` },
  { topic: 'Music', teacher: 'Mr. Johnson', location: 'Golders Green', price: 80, space: 5, icon: '🎼', image: `${BASE_URL}/images/music.jpg` },
  { topic: 'Drama', teacher: 'Ms. Kelly', location: 'Hendon', price: 70, space: 5, icon: '🎭', image: `${BASE_URL}/images/drama.jpg` },
  { topic: 'Sports', teacher: 'Coach Adams', location: 'Colindale', price: 65, space: 5, icon: '🏅', image: `${BASE_URL}/images/sports.jpg` },
  { topic: 'Physics', teacher: 'Mme. Dubois', location: 'Golders Green', price: 92, space: 5, icon: '⚛️', image: `${BASE_URL}/images/phy.jpg` },
  { topic: 'Spanish', teacher: 'Mr. Rivera', location: 'Brent Cross', price: 92, space: 5, icon: '🇪🇸', image: `${BASE_URL}/images/spanish.jpg` },
  { topic: 'Biology', teacher: 'Dr. Evans', location: 'Colindale', price: 97, space: 5, icon: '🧬', image: `${BASE_URL}/images/bio.jpg` },
  { topic: 'Chemistry', teacher: 'Dr. Ahmed', location: 'Hendon', price: 98, space: 5, icon: '⚗️', image: `${BASE_URL}/images/chem.jpg` },
  { topic: 'Culinary', teacher: 'Mr. Clark', location: 'Hendon', price: 110, space: 5, icon: '👨‍🍳', image: `${BASE_URL}/images/culinary.jpg` },
  { topic: 'Economics', teacher: 'Dr. Moore', location: 'Golders Green', price: 105, space: 5, icon: '💰', image: `${BASE_URL}/images/eco.jpg` },
  { topic: 'Psychology', teacher: 'Ms. Taylor', location: 'Brent Cross', price: 99, space: 5, icon: '🧠', image: `${BASE_URL}/images/psychology.jpg` },
  { topic: 'Philosophy', teacher: 'Dr. White', location: 'Colindale', price: 90, space: 5, icon: '🤔', image: `${BASE_URL}/images/philosophy.jpg` },
  { topic: 'Computer Science', teacher: 'Mr. Zhao', location: 'Hendon', price: 125, space: 5, icon: '🖥️', image: `${BASE_URL}/images/cs.jpg` },
  { topic: 'Robotics', teacher: 'Dr. Kim', location: 'Colindale', price: 130, space: 5, icon: '🤖', image: `${BASE_URL}/images/robotics.jpg` },
];

// 🚀 Seeder
async function run() {
  const client = new MongoClient(process.env.MONGO_URI);
  try {
    console.log("🔗 Connecting to:", process.env.MONGO_URI);
    await client.connect();
    const db = client.db(process.env.DB_NAME || 'AfterSchoolDB');
    console.log("📁 Connected to database:", db.databaseName);

    // Delete existing lessons first
    const del = await db.collection('lesson').deleteMany({});
    console.log(`🧹 Cleared ${del.deletedCount} old records.`);

    // Insert new lessons
    const result = await db.collection('lesson').insertMany(lessons);
    console.log(`✅ Seeded ${result.insertedCount} lessons.`);
    console.log(`📸 Image base URL: ${BASE_URL}`);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
  } finally {
    await client.close();
    console.log("🔒 MongoDB connection closed.");
  }
}

// 🏁 Run Seeder
run();
