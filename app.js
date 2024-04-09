const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const exphbs = require('express-handlebars');
const sequelize = require('./config/database'); // Assuming Sequelize configuration is in config/database.js

// Importing models
const Post = require('./models/Post');
const User = require('./models/User');

// Importing routes
const indexRoutes = require('./routes/index');
const userRoutes = require('./routes/user');

const app = express();

// Handlebars middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Define routes
app.use('/', indexRoutes);
app.use('/user', userRoutes); // Assuming user-related routes are prefixed with '/user'

// Connect to MySQL database using Sequelize
sequelize
  .authenticate()
  .then(() => {
    console.log('Database connected successfully.');
    // Sync models with database (create tables if they don't exist)
    return sequelize.sync();
  })
  .then(() => {
    console.log('Models synced with database.');
    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });
