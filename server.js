const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const methodoverride = require('method-override')

const app = express();


require("dotenv").config();

app.use(express.urlencoded( { extended: true} ));
app.use(express.static('public'));
app.use(expressLayouts);
app.use(methodoverride('_method'));


app.use(cookieParser('RecipeBlogSecure'));
app.use(session({
  secret: 'RecipeBlogSecretSession',
  saveUninitialized: true,
  resave: true
}));
app.use(flash());
app.use(fileUpload());



app.set('layout', './layouts/main');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



const routes = require('./server/routes/recipeRoutes.js');
app.use('/', routes);

app.listen(process.env.PORT, ()=> console.log(`Listening to port ${process.env.PORT}`));




