// TRUE NEGATIVE: marketing signup form — not OAuth, must not trigger
const express = require('express');
const router = express.Router();

router.post('/newsletter', async (req, res) => {
  const { email, name } = req.body;
  const subscriber = await db.findUser({ email: email });
  if (!subscriber) {
    await db.createUser({ email: email, name: name, source: 'newsletter' });
  }
  res.json({ subscribed: true });
});

module.exports = router;
