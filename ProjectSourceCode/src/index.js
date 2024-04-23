// *****************************************************
// <!-- Section 1 : Import Dependencies -->
// *****************************************************

const express = require('express'); // To build an application server or API
const app = express();
const handlebars = require('express-handlebars');
const Handlebars = require('handlebars');
const path = require('path');
const pgp = require('pg-promise')(); // To connect to the Postgres DB from the node server
const bodyParser = require('body-parser');
const session = require('express-session'); // To set the session object. To store or access session data, use the `req.session`, which is (generally) serialized as JSON by the store.
const bcrypt = require('bcrypt'); //  To hash passwords
const axios = require('axios'); // To make HTTP requests from our server. We'll learn more about it in Part B.

// *****************************************************
// <!-- Section 2 : Connect to DB -->
// *****************************************************

// create `ExpressHandlebars` instance and configure the layouts and partials dir.
const hbs = handlebars.create({
  extname: 'hbs',
  layoutsDir: __dirname + '/views/layouts',
  partialsDir: __dirname + '/views/partials',
});

// database configuration
const dbConfig = {
  host: 'db', // the database server
  port: 5432, // the database port
  database: process.env.POSTGRES_DB, // the database name
  user: process.env.POSTGRES_USER, // the user account to connect with
  password: process.env.POSTGRES_PASSWORD, // the password of the user account
};

// remember to change later. 
// const pgpdbConfig = {
//     host: process.env.host,
//     port: 5432, // the database port
//     database: process.env.POSTGRES_DB, // the database name
//     user: process.env.POSTGRES_USER, // the user account to connect with
//     password: process.env.POSTGRES_PASSWORD, // the password of the user account
//     port: 5432,
//     database: process.env.database,
//     user: process.env.user,
//     password: process.env.password
// }

// remember to change later. 
const db = pgp(dbConfig);

// test your database
db.connect()
  .then(obj => {
    console.log('Database connection successful'); // you can view this message in the docker compose logs
    obj.done(); // success, release the connection;
  })
  .catch(error => {
    console.log('ERROR:', error.message || error);
  });

// *****************************************************
// <!-- Section 3 : App Settings -->
// *****************************************************

// Register `hbs` as our view engine using its bound `engine()` function.
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json()); // specify the usage of JSON for parsing request body.
app.use(express.static(__dirname + '/'));
// initialize session variables
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
  })
);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// *****************************************************
// <!-- Section 4 : API Routes -->
// *****************************************************
app.get('/', (req, res) => {
  res.redirect('/register');
});

app.get('/login', (req, res) => {
  res.render('pages/login');
});

app.get('/register', (req, res) => {
  res.render('pages/register');
});


const fetchRecommendedClasses = (req, res, next) => {
  if (req.session.user) {
    const username = req.session.user.username;
    const recommended_classes_query = `
    SELECT *
    FROM classes c
    INNER JOIN (
        SELECT SUBSTRING(class_id, 1, 6) AS prefix, class_id
        FROM user_classes 
        WHERE username = $1
    ) uc ON c.class_id LIKE CONCAT(uc.prefix, '%') AND uc.class_id > c.class_id
    LEFT JOIN prerequisites p ON c.class_id = p.class_id
    WHERE NOT EXISTS (
        SELECT 1 
        FROM user_classes uc2 
        WHERE uc2.class_id = c.class_id
    )
    LIMIT 7;
    `;
    

  


    db.any(recommended_classes_query, [username])
      .then(recommended => {
        // Attach recommended classes to response locals
        res.locals.recommendedClasses = recommended;
        next(); // Proceed to the next middleware
      })
      .catch(err => {
        res.locals.recommendedClasses = []; // Set empty array in case of error
        next(); // Proceed to the next middleware
      });
  } else {
    // If user is not logged in, set recommendedClasses to empty array
    res.locals.recommendedClasses = [];
    next(); // Proceed to the next middleware
  }
};

// Apply the middleware to all routes
app.use(fetchRecommendedClasses);

const fetchTrendingClasses = (req, res, next) => {
  const trending_classes_query = `
  SELECT c.class_id, c.name, COUNT(uc.username) AS num_entries
  FROM classes c
  JOIN user_classes uc ON c.class_id = uc.class_id
  GROUP BY c.class_id, c.name
  ORDER BY num_entries DESC
  LIMIT 5;

`;
  db.any(trending_classes_query)
    .then(trending => {
      // Attach recommended classes to response locals
      res.locals.trendingClasses = trending;
      next(); // Proceed to the next middleware
    })
    .catch(err => {
      res.locals.trendingClasses = []; // Set empty array in case of error
      next(); // Proceed to the next middleware
    });
};

// Apply the middleware to all routes
app.use(fetchTrendingClasses);

app.get('/classes', (req, res) => {
    res.render('pages/classes',{
      loggedIn:true
    })
});


app.get('/home', (req, res) => {
  console.log(req.session);
  res.render('pages/home',{
    loggedIn:true
  });
});


app.get('/userprofile', async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.session || !req.session.user || !req.session.user.username) {
      // If not authenticated, redirect to login page
      return res.redirect('/login');
    }

    const username = req.session.user.username;

    // Fetch user details from user_details table
    const userDetails = await db.oneOrNone('SELECT * FROM user_details WHERE username = $1', username);

    // Fetch user classes from user_classes table
    const userClasses = await db.any('SELECT class_id FROM user_classes WHERE username = $1', username);

    // Fetch class names associated with the user
    const classNames = await Promise.all(userClasses.map(async (classItem) => {
      const classId = classItem.class_id;
      const className = await db.one('SELECT name FROM classes WHERE class_id = $1', classId);
      return className;
    }));

    // If user details found, render the userprofile page
    if (userDetails) {
      res.status(200).render('pages/userprofile',
      {
        loggedIn:true,
        username: req.session.user.username,
        email: userDetails.email,
        age: userDetails.age,
        classes: classNames
      });
    } else {
      res.status(404).render('pages/error', { error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).render('pages/error', { error: 'Internal server error' });
  }
});



// *****************************************************
// <!--Dummy API -->
// *****************************************************
app.get('/welcome', (req, res) => {
    res.json({status: 'success', message: 'Welcome!'});
  });
// -------------------------------------  ROUTES for register.hbs   ----------------------------------------------
app.post('/register', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).render('pages/register',{ error: 'Username and password cannot be blank' });
  }

  const hash = await bcrypt.hash(req.body.password, 10);

  if (hash.err) { 
    console.log('error');
    return res.status(400).render('pages/register', { error: 'Error occurred while hashing password' });
  }
  else {console.log('check');

  const existingUserDetails = await db.oneOrNone('SELECT * FROM users WHERE username = $1', username);

  if (existingUserDetails) {
    console.log('error');
    return res.status(400).render('pages/register', { error: 'Username already taken' });
  }
  db.tx(async t=> {
    await t.any('INSERT INTO users (username, password) VALUES ($1, $2);', [req.body.username, hash]);
  })
  req.session.message = 'User registered successfully';
  res.status(200).redirect('/login');

  }
});

// -------------------------------------  ROUTES for login.hbs   ----------------------------------------------
app.post('/login', async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;


    if (!username || !password) {
      return res.status(400).render('pages/login', { error: 'Username and password cannot be blank' });
    }


    const user = await db.oneOrNone('SELECT * FROM users WHERE username = $1', [username]);


    if (!user) {
      return res.status(401).render('pages/login', { error: 'User not found' });
    }
   
    const passMatch = await bcrypt.compare(password, user.password);


    if (passMatch) {
      const existingUserDetails = await db.oneOrNone('SELECT * FROM user_details WHERE username = $1', username);


      if (!existingUserDetails) {
        const email = ""; 
        const age = null; 
     
        await db.none('INSERT INTO user_details (username, email, age) VALUES ($1, $2, $3)', [username, email, age]);
      }


      req.session.user = user;
      req.session.save();
      return res.status(200).redirect('/home');
    } else {
      return res.status(401).render('pages/login', { error: 'Incorrect password' });
    }
  } catch (error) {
    console.error('Error occurred while logging in:', error.message);
    res.status(500).render('pages/login', { error: 'Internal server error' });
  }
}); 

const auth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
};

app.use(auth);

// -------------------------------------  ROUTES for classes.hbs   ----------------------------------------------
const search_classes_query = "SELECT * FROM classes WHERE name LIKE $1";

app.get('/classes/search', (req, res) => {
    const searchTerm = req.query.term;

    db.any(search_classes_query, [`%${searchTerm}%`])
        .then(classes => {
            res.render('pages/classes', { classes, searchTerm });
        })
        .catch(err => {
            res.render('pages/error', { message: err.message });
        });
});

// app.post('/classes/add', async (req, res) => {
//   try {
//       const { class_id } = req.body;

//       if (!class_id) {
//           return res.status(400).send({ error: 'Missing class_id in request body' });
//       }
//       // find some way to pass the whole class cart
//       const username = req.session.user.username;

//       const existingClass = await db.oneOrNone('SELECT * FROM user_classes WHERE username = $1 AND class_id = $2', [username, class_id]);
//       if (existingClass) {
//           return res.status(400).send({ error: 'Class already added' });
//       }
//       //for loop
//       await db.none('INSERT INTO user_classes (username, class_id) VALUES ($1, $2)', [username, class_id]);
      
//       res.render('pages/classes', { 
//         message: 'Class added successfully'
//       });
//   } catch (error) {
//       console.error('Error occurred while adding class to user_classes:', error);
//       res.status(500).send({ success: false, error: 'Internal server error' });
//   }
// });

//Add classes from cart
app.post('/classes/add', async (req, res) => {
  try {
      const classCart = req.body.classCart;

      if (!classCart || !Array.isArray(classCart) || classCart.length === 0) {
          return res.status(400).send({ error: 'Invalid class cart data' });
      }

      const username = req.session.user.username;
      let errorMessage = ''; // Initialize an empty error message string

      for (const classItem of classCart) {
          const { classId, className } = classItem;

          const existingClass = await db.oneOrNone('SELECT * FROM user_classes WHERE username = $1 AND class_id = $2', [username, classId]);
          if (existingClass) {
              errorMessage += `Class ${classId} (${className}) already added<br>`;
              continue; // Skip to the next class
          }
          
          const non_added_prereqs = await db.oneOrNone(
            `
            SELECT *
            FROM classes
            WHERE class_id = $1
            AND class_id IN (
                SELECT class_id
                FROM prerequisites
                WHERE prereq_id NOT IN (
                    SELECT class_id
                    FROM user_classes
                    WHERE username = $2
                )
            )
            `,
            [classId, username]
          );
          
          if (non_added_prereqs) {
              errorMessage += `User does not have required prerequisites for ${classId} (${className})<br>`;
              continue; // Skip to the next class
          }

          // Insert class into database
          await db.none('INSERT INTO user_classes (username, class_id) VALUES ($1, $2)', [username, classId]);
          console.log(`Class ${classId} (${className}) added successfully`);
      }

      if (errorMessage) {
          res.status(400).render('pages/home',{ error: errorMessage }); // Sending error messages
      } else {
          res.status(200).render('pages/home',{ message: 'Classes added successfully' });
      }
  } catch (error) {
      console.error('Error occurred while adding classes to user_classes:', error);
      res.status(500).render('pages/home',{ success: false, error: 'Internal server error' });
  }
});


app.get('/classes/check', async (req, res) => {
  try {
      const { classId } = req.query; // Get classId from the query parameters

      // Check if the class exists in the user_classes table
      const existingClass = await db.oneOrNone('SELECT * FROM user_classes WHERE class_id = $1', [classId]);

      // Send response based on whether the class exists
      if (existingClass) {
          res.json({ exists: true }); // Class exists
      } else {
          res.json({ exists: false }); // Class does not exist
      }
  } catch (error) {
      console.error('Error checking class:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

// -------------------------------------  ROUTES for userprofile.hbs   ----------------------------------------------

app.post('/userprofile', async (req, res) => {
  try {
    const username = req.session.user.username;
    const { newEmail, newAge, newPassword } = req.body;
    console.log('Received JSON data:', { username, newEmail, newAge, newPassword });


    await db.none('UPDATE user_details SET email = $1, age = $2 WHERE username = $3', [newEmail, newAge, username]);


    // Update password if newPassword is provided
    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await db.none('UPDATE users SET password = $1 WHERE username = $2', [hashedPassword, username]);
    }


    // Send a response indicating success
    res.status(200).json({ message: 'User profile updated successfully' });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// -------------------------------------  ROUTES for logout.hbs   ----------------------------------------------
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.render('pages/logout',{
    loggedIn:true
  });
});

// *****************************************************
// <!-- Section 5 : Start Server-->
// *****************************************************
// starting the server and keeping the connection open to listen for more requests
module.exports = app.listen(3000);
console.log('Server is listening on port 3000');