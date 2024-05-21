const express = require('express');
const router = express.Router();
const CalorieEntry = require('../models/nutritions');
const mongoose = require('mongoose');

router.post('/', async (req, res) => {
    const { user_id, date, recipe_name, calories, protein, sugar } = req.body;  // Include protein and sugar in the destructuring
    try {
        const newEntry = new CalorieEntry({
            user_id,
            date: new Date(date), // Ensure date is stored correctly
            recipe_name,
            calories,
            protein,  
            sugar,     
        });

        await newEntry.save();
        res.status(201).json(newEntry);
    } catch (error) {
        if (error.code === 11000) {
            // Handle the duplicate key error
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
                    user_id: new mongoose.Types.ObjectId(user_id),
                    date: { $gte: new Date(startDate), $lte: new Date(endDate) }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                    totalCalories: { $sum: "$calories" },
                    totalProtein: { $sum: "$protein" }, 
                    totalSugar: { $sum: "$sugar" },     
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


// DELETE route to delete all entries for a specific user
router.delete('/:user_id', async (req, res) => {
    const { user_id } = req.params;

    try {
        const result = await CalorieEntry.deleteMany({ user_id: user_id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'No entries found for this user' });
        }

        res.status(200).json({ message: 'All entries for the user deleted successfully' });
    } catch (error) {
        console.error('Error deleting the entries:', error);
        res.status(500).json({ message: 'Failed to delete the entries: ' + error.message });
    }
});


router.get('/last30days/:user_id', async (req, res) => {
    const { user_id } = req.params;
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999); // Set the time to the last millisecond of the current day
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 29); // 30 days including today
    startDate.setHours(0, 0, 0, 0);

    try {
        const pipeline = [
            {
                $match: {
                    user_id: new mongoose.Types.ObjectId(user_id),
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                    totalCalories: { $sum: "$calories" },
                    totalProtein: { $sum: "$protein" },
                    totalSugar: { $sum: "$sugar" }
                }
            },
            {
                $sort: { "_id": 1 }
            }
        ];

        const result = await CalorieEntry.aggregate(pipeline);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching sum of data for the last 30 days:', error);
        res.status(500).json({ message: 'Failed to fetch sum of data for the last 30 days: ' + error.message });
    }
});


module.exports = router;
