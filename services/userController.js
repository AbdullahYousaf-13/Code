// userController.js
const db = require('../db_connection');

const getAllUsers = (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results);
  });
};

const getUserById = (req, res) => {
  const userId = req.params.id;

  db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    // Check if user with given ID exists
    if (results.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(results[0]); // Assuming user IDs are unique, so only one result should be returned
  });
};

const createUser = (req, res) => {
  const { 
    username,
    email,
    password,
    userType,
    contactNumber,
    gender,
    expertise,
    qualification,
    dob,
    weight,
    height
   } = req.body;

  // Validation (you can add more validation as needed)
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Invalid input. Please provide username, email, and password.' });
  }

  // Insert the new user into the MySQL database
  // Assuming userType is set to 'fitness_enthusiast', 'trainer', or 'dietitian'
  db.query('INSERT INTO users (username, email, password, contactNumber, userType) VALUES (?, ?, ?, ?, ?)', [username, email, password, contactNumber, userType], (err, result) => {
  if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
  }

  const userId = result.insertId;

  // Based on userType, insert data into the corresponding role-specific table
  switch (userType) {
      case 'fitness_enthusiast':
          db.query('INSERT INTO fitness_enthusiast (userId, gender, weight, height, dob, dietitian_id, diet_plan_id, workout_id, trainer_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [userId, gender, weight, height, dob, 1,1,1,1], (err) => {
              if (err) {
                  console.error('Error executing MySQL query:', err);
                  res.status(500).json({ error: 'Internal Server Error' });
                  return;
              }
              res.status(201).json({ userId, username, email, password, userType, gender, weight, height, dob });
          });
          break;

      case 'trainer':
          db.query('INSERT INTO trainers (userId, expertise) VALUES (?, ?)', [userId, expertise], (err) => {
              if (err) {
                  console.error('Error executing MySQL query:', err);
                  res.status(500).json({ error: 'Internal Server Error' });
                  return;
              }
              res.status(201).json({ userId, username, email, password, userType, expertise });
          });
          break;

      case 'dietitian':
          db.query('INSERT INTO dietitians (userId, qualification) VALUES (?, ?)', [userId, qualification], (err) => {
              if (err) {
                  console.error('Error executing MySQL query:', err);
                  res.status(500).json({ error: 'Internal Server Error' });
                  return;
              }
              res.status(201).json({ userId, username, email, password, userType, qualification });
          });
          break;

      default:
          res.status(400).json({ error: 'Invalid userType' });
  }
});

};

const deleteUser = (req, res) => {
  const userId = req.params.id;
  // Delete from fitness_enthusiast table
  db.query('DELETE FROM fitness_enthusiast WHERE userId = ?', [userId], (err, result) => {
      if (err) {
          console.error('Error deleting from fitness_enthusiast:', err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
      }

      // Delete from trainer table
      db.query('DELETE FROM trainer WHERE userId = ?', [userId], (err, result) => {
          if (err) {
              console.error('Error deleting from trainer:', err);
              res.status(500).json({ error: 'Internal Server Error' });
              return;
          }

          // Delete from dietitian table
          db.query('DELETE FROM dietitian WHERE userId = ?', [userId], (err, result) => {
              if (err) {
                  console.error('Error deleting from dietitian:', err);
                  res.status(500).json({ error: 'Internal Server Error' });
                  return;
              }

              // Delete from users table
              db.query('DELETE FROM users WHERE id = ?', [userId], (err, result) => {
                  if (err) {
                      console.error('Error deleting from users:', err);
                      res.status(500).json({ error: 'Internal Server Error' });
                      return;
                  }

                  // Check if the user was found and deleted
                  if (result.affectedRows > 0) {
                      res.status(200).json({ message: 'User and associated data deleted successfully' });
                  } else {
                      res.status(404).json({ error: 'User not found' });
                  }
              });
          });
      });
  });
};

const getAllFitnessEnthusiast = (req, res) => {
  db.query('SELECT * FROM fitness_enthusiast', (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results);
  });
};

const getFitnessEnthusiastById = (req, res) => {
  const userId = req.params.id;

  db.query('SELECT * FROM fitness_enthusiast WHERE userId = ?', [userId], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    // Check if user with given ID exists
    if (results.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(results[0]); // Assuming user IDs are unique, so only one result should be returned
  });
};

const getAllTrainers = (req, res) => {
  db.query('SELECT * FROM trainers', (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results);
  });
};

const getAllWorkouts = (req, res) => {
  db.query('SELECT * FROM workouts', (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results);
  });
};

const getAllDietitian = (req, res) => {
  db.query('SELECT * FROM dietitians', (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results);
  });
};

const getAllDietPlans = (req, res) => {
  db.query('SELECT * FROM diet_plans', (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results);
  });
};

// const createWorkout = (req, res) => {
//   const { 
//     username,
//     email,
//     password,
//     userType,
//     contactNumber,
//     gender,
//     expertise,
//     qualification,
//     dob,
//     weight,
//     height
//    } = req.body;

//   // Validation (you can add more validation as needed)
//   if (!username || !email || !password) {
//     return res.status(400).json({ error: 'Invalid input. Please provide username, email, and password.' });
//   }

//   // Insert the new user into the MySQL database
//   // Assuming userType is set to 'fitness_enthusiast', 'trainer', or 'dietitian'
//   db.query('INSERT INTO users (username, email, password, contactNumber, userType) VALUES (?, ?, ?, ?, ?)', [username, email, password, contactNumber, userType], (err, result) => {
//   if (err) {
//       console.error('Error executing MySQL query:', err);
//       res.status(500).json({ error: 'Internal Server Error' });
//       return;
//   }

//   const userId = result.insertId;
//   res.status(201).json({ userId, username, email, password, userType, gender, weight, height, dob });
// });
// };

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  deleteUser,
  getAllFitnessEnthusiast,
  getFitnessEnthusiastById,
  getAllTrainers,
  getAllWorkouts,
  getAllDietitian,
  getAllDietPlans,
  // Add other functions here
};
