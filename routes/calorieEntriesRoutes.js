const express = require('express');
const router = express.Router();
const CalorieEntry = require('../models/calorieEntry');
const mongoose = require('mongoose');

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



router.get('/:user_id', async (req, res) => {
    const { user_id } = req.params;
    const { startDate, endDate } = req.query;

    try {
        const pipeline = [
            {
                $match: {
                    user_id: new mongoose.Types.ObjectId(user_id), // Correct usage
                    date: { $gte: new Date(startDate), $lte: new Date(endDate) }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                    totalCalories: { $sum: "$calories" },
                    entries: { $push: "$$ROOT" }  // Pushing the entire document into entries array
                }
            },
            {
                $sort: { "_id": 1 }  // Sorting by date (ascending)
            }
        ];

        const result = await CalorieEntry.aggregate(pipeline);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching calorie entries:', error);
        res.status(500).json({ message: 'Failed to fetch calorie entries: ' + error.message });
    }
});




module.exports = router;