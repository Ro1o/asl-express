// middleware/validateOrder.js
module.exports = function validateOrder(req, res, next) {
  const { lessonId, name, phone } = req.body;

  // 1️⃣ Check required fields
  if (!lessonId || !name || !phone) {
    return res.status(400).json({ error: "All fields (lessonId, name, phone) are required." });
  }

  // 2️⃣ Validate name (only letters and spaces)
  const nameRegex = /^[A-Za-z\s]+$/;
  if (!nameRegex.test(name)) {
    return res.status(400).json({ error: "Name must contain only letters and spaces." });
  }

  // 3️⃣ Validate phone (digits only, 8–12 digits)
  const phoneRegex = /^[0-9]{8,12}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ error: "Phone number must contain 8–12 digits." });
  }

  // ✅ If all good, continue
  next();
};
