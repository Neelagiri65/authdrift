// TRUE NEGATIVE: contact form handler — not OAuth, must not trigger
const express = require('express');
const router = express.Router();

router.post('/contact', async (req, res) => {
  const { email, name, message } = req.body;
  const user = await db.findUser({ email: email });
  if (!user) {
    await db.createUser({ email: email, name: name });
  }
  await db.createTicket({ userId: user.id, message });
  res.json({ ok: true });
});

module.exports = router;
