const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    console.log('User logged out');
    res.status(200).json({ message: "Logout successful" });
});

module.exports = router;
