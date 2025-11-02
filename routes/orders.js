const express = require('express');
const { ObjectId } = require('mongodb');
const validateOrder = require('../middleware/validateOrder'); // ✅ custom validation middleware
const router = express.Router();

/**
 * POST /orders
 * Create a new order for a lesson
 */
router.post('/', validateOrder, async (req, res, next) => {
  try {
    const db = req.app.locals.db;
    const { lessonId, name, phone } = req.body;

    // 1️⃣ Validate ObjectId format
    if (!ObjectId.isValid(lessonId)) {
      return res.status(400).json({ error: "Invalid lesson ID format." });
    }

    // 2️⃣ Access collections
    const lessonsCol = db.collection('lessons');
    const ordersCol = db.collection('orders');

    // 3️⃣ Find the lesson by ID
    const lesson = await lessonsCol.findOne({ _id: new ObjectId(lessonId) });
    if (!lesson) {
      return res.status(404).json({ error: "Lesson not found." });
    }

    // 4️⃣ Check for available spaces
    if (lesson.space <= 0) {
      return res.status(400).json({ error: "No spaces available." });
    }

    // 5️⃣ Create order object
    const newOrder = {
      lessonId: new ObjectId(lessonId),
      name,
      phone,
      date: new Date(),
    };

    // 6️⃣ Insert into orders collection
    const result = await ordersCol.insertOne(newOrder);

    // 7️⃣ Decrement lesson space
    await lessonsCol.updateOne(
      { _id: new ObjectId(lessonId) },
      { $inc: { space: -1 } }
    );

    // 8️⃣ Respond with success
    res.status(201).json({
      message: "✅ Order created successfully",
      orderId: result.insertedId,
      order: newOrder,
    });
  } catch (err) {
    console.error("❌ Error creating order:", err);
    next(err); // 🔁 Send error to centralized handler
  }
});

/**
 * GET /orders
 * Returns all orders
 */
router.get('/', async (req, res, next) => {
  try {
    const db = req.app.locals.db;
    const orders = await db.collection('orders').find().toArray();
    res.status(200).json(orders);
  } catch (err) {
    console.error("❌ Error fetching orders:", err);
    next(err); // 🔁 Forward to error handler
  }
});

module.exports = router;
