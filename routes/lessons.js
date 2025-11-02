// routes/lessons.js
const express = require('express');
const { ObjectId } = require('mongodb');

const router = express.Router();

/**
 * GET /lessons
 * Returns all lessons as JSON.
 */
router.get('/', async (req, res) => {
  try {
    // 1) Grab the live DB connection stored by server.js
    const db = req.app.locals.db;

    // 2) Use the "lesson" collection (matches coursework name)
    const lessons = await db
      .collection('lesson')
      .find({}, { projection: { topic: 1, teacher: 1, location: 1, price: 1, space: 1, icon: 1 , image : 1} })
      // optional: sort by topic ascending so output is stable
      .sort({ topic: 1 })
      .toArray();

    res.json(lessons);
  } catch (err) {
    console.error('GET /lessons failed:', err);
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
});

/**
 * PUT /lessons/:id
 * Updates ANY attribute of a lesson (required by coursework).
 * Example body: { "space": 4 } or { "price": 99 }
 */
router.put('/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;

    // 1) validate :id
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid lesson id' });
    }

    // 2) payload: ANY attribute is allowed to be updated (as per spec)
    const updatePayload = req.body ?? {};
    if (Object.keys(updatePayload).length === 0) {
      return res.status(400).json({ error: 'No fields provided to update' });
    }

    // 3) perform update
    const result = await db.collection('lesson').updateOne(
      { _id: new ObjectId(id) },
      { $set: updatePayload }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    res.json({
      ok: true,
      matched: result.matchedCount,
      modified: result.modifiedCount,
      id,
      updated: updatePayload,
    });
  } catch (err) {
    console.error('PUT /lessons/:id failed:', err);
    res.status(500).json({ error: 'Failed to update lesson' });
  }
});

module.exports = router;
