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
    SELECT c.* 
    FROM classes c
    JOIN (
        SELECT SUBSTRING(class_id, 1, 6) AS prefix, class_id
        FROM user_classes 
        WHERE username = $1
        LIMIT 7
    ) uc ON c.name LIKE CONCAT(uc.prefix, '%') AND c.name != uc.class_id;
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

app.get('/classes', (req, res) => {
    res.render('pages/classes')
});


app.get('/home', (req, res) => {
  res.render('pages/home');
});

app.get('/shoppingcart', (req, res) => {
  res.render('pages/shoppingcart');
});

app.get('/userprofile', (req, res) => {
  const username = req.session.user.username;
  res.render('pages/userprofile', { username });
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
    return res.status(400).send({ message: 'Username and password cannot be blank' });
  }

  const hash = await bcrypt.hash(req.body.password, 10);

  if (hash.err) { 
    console.log('error');
    res.status(400).send({ message: 'Error occurred while hashing password' });
  }
  else {console.log('check');

  db.tx(async t=> {
    await t.any('INSERT INTO users (username, password) VALUES ($1, $2);', [req.body.username, hash]);
  })
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

app.post('/classes/add', async (req, res) => {
  try {
      const { class_id } = req.body;

      if (!class_id) {
          return res.status(400).send({ error: 'Missing class_id in request body' });
      }

      const username = req.session.user.username;

      const existingClass = await db.oneOrNone('SELECT * FROM user_classes WHERE username = $1 AND class_id = $2', [username, class_id]);
      if (existingClass) {
          return res.status(400).send({ error: 'Class already added' });
      }

      await db.none('INSERT INTO user_classes (username, class_id) VALUES ($1, $2)', [username, class_id]);
      
      res.render('pages/classes', { 
        message: 'Class added successfully'
      });
  } catch (error) {
      console.error('Error occurred while adding class to user_classes:', error);
      res.status(500).send({ success: false, error: 'Internal server error' });
  }
});


// -------------------------------------  ROUTES for logout.hbs   ----------------------------------------------
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.render('pages/logout');
});

// *****************************************************
// <!-- Section 5 : Start Server-->
// *****************************************************
// starting the server and keeping the connection open to listen for more requests
module.exports = app.listen(3000);
console.log('Server is listening on port 3000');