const express = require('express');
const router = express.Router();
const CalorieEntry = require('../models/calorieEntry');

router.post('/', async (req, res) => {
    const { user_id, date, recipe_name, calories } = req.body;
    try {
        const newEntry = new CalorieEntry({
            user_id,
            date: new Date(date), // Ensure date is stored correctly
            recipe_name,
            calories
        });

        await newEntry.save();
        res.status(201).json(newEntry);
    } catch (error) {
        if (error.code === 11000) {
            // This block specifically handles the duplicate key error
            return res.status(409).json({ message: 'This recipe has already been scheduled for this date. Please choose another date or recipe.' });
        }
        console.error('Error saving the entry:', error);
        res.status(400).json({ message: 'An error occurred while saving the entry: ' + error.message });
    }
});



module.exports = router;