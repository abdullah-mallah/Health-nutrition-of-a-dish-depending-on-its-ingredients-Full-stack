const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("MongoDB is connected");
    } catch (err) {
        console.log("Error in connecting to MongoDB", err);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
