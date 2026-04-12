// TRUE NEGATIVE: password reset flow — uses email but not in OAuth context
const express = require('express');
const router = express.Router();

router.post('/reset-password', async (req, res) => {
  const { email } = req.body;
  const user = await db.findUser({ email: email });
  if (user) {
    const token = crypto.randomBytes(32).toString('hex');
    await db.createPasswordReset({ userId: user.id, token, email: email });
    await sendResetEmail(user.email, token);
  }
  res.json({ message: 'If an account exists, a reset link has been sent.' });
});

module.exports = router;
