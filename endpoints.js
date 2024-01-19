// routes.js
const express = require('express');
const router = express.Router();
const userController = require('./services/userController');

// Define routes
router.get('/users', userController.getAllUsers);
router.post('/users', userController.createUser);
router.get('/users/:id', userController.getUserById);
router.delete('/users/:id', userController.deleteUser);
router.get('/fitness_enthusiasts', userController.getAllFitnessEnthusiast);
router.get('/fitness_enthusiasts/:id', userController.getFitnessEnthusiastById);
router.get('/trainers', userController.getAllTrainers);
router.get('/workouts', userController.getAllWorkouts);
router.get('/dietitians', userController.getAllDietitian);
router.get('/diet_plans', userController.getAllDietPlans);
// Add other routes here

module.exports = router;
