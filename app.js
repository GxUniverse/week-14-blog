require('dotenv').config();

//dependancies

const express = require('express');
const expressLayout = require('express-ejs-layouts');

const connectDB = require('../week-14-blog/server/config/db');
const cookieParser = require('cookie-parser');
const session = require ('express-session')
const MongoStore = require('connect-mongo');

const app = express();
const PORT = 3001 || process.env.PORT;

//connect to database
connectDB();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
}));

app.use(express.static('public'));


app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.use('/', require('../week-14-blog/server/routes/main'));
app.use('/', require('../week-14-blog/server/routes/admin'));

app.listen(PORT, ()=> {
    console.log(`App listening on port ${PORT}`);
});