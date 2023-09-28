const mongoose = require('mongoose');
require('dotenv').config()

mongoose.connect(process.env.MONGODB_URI);
const db= mongoose.connection;


db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
    console.log('connected to MongoDB')
});

//Models
require('./Category');
require('./Recipe');
