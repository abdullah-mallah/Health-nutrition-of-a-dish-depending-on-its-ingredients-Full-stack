# Health and Nutrition Web Application

## Introduction

This web application is designed to help users manage their health and nutrition through a variety of features such as recipe searching, meal scheduling, nutrition tracking, and ingredient searching. It provides a user-friendly platform to find recipes tailored to dietary preferences, plan meals, and monitor nutritional intake, addressing the challenges of maintaining a balanced diet in today’s fast-paced world.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

### Installing

Clone the repository to your local machine:

```bash
git clone https://github.com/abdullah-mallah/Health-nutrition-of-a-dish-depending-on-its-ingredients-Full-stack.git
```

Install the necessary npm packages:

```bash
npm install
```

### Configuration

Create a .env file in the root directory of the project and update the following settings: all setting are provided in the report!

```env
PORT = 5000
URI = 
API_ID=
API_KEY=
TOKEN_SECRET=
API_KEY_INGREDIANT =
```

### Running the Application

To start the server, run:
```bash
npm start
nodemon server.js
```

This will launch the server on http://localhost:5000. Open a web browser and navigate to this address: http://localhost:5000/login.html to view the application.

### Features

- User Authentication: Sign up, log in, and log out functionality with JWT for secure sessions.
- Recipe Management: Search and filter recipes based on dietary needs and preferences.
- Meal Scheduling: Schedule recipes as meals with a calendar interface.
- Nutrition Tracking: Track the nutritional content of meals, with custom and 30-day views.
- Ingredient Search: Search for specific nutrients in ingredients.

### Technical Solution

### System Architecture

The application is structured into a frontend built with HTML5, CSS, and JavaScript, and a backend powered by Node.js and Express.js. MongoDB is used for the database.

### Frontend
- HTML5/CSS: For structuring and styling the application pages.
- Bootstrap: For responsive design elements.
- JavaScript: To add interactivity to web pages.

### Backend
- Node.js and Express.js: For handling server-side logic, API routing, and session management.
- MongoDB: For storing user data, recipe information, and nutritional data.

### APIs Used

- Edamam Recipe Search API: Provides recipe data and nutritional information.
- Spoonacular Food Ingredients API: Used for searching food ingredients and retrieving nutritional data.

### Security
- JWT (JSON Web Tokens): For securing API endpoints and managing user sessions.
- bcrypt: For hashing and securing user passwords.

### Authors
- Abdullah Mallah - Full Stack Developer
- Omar Zarifa - Full Stack Developer and Designer
- Mustafa Qassmieh - Frontend Developer
- Fiona Maci - Frontend Developer
- Shadia Nalule - Frontend Developer