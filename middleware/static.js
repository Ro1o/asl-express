const path = require('path');
const fs = require('fs');

module.exports = function (req, res, next) {
  const imagePath = path.join(__dirname, '../public', req.path);
  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath);
  } else {
    res.status(404).json({ error: 'Image not found' });
  }
};
