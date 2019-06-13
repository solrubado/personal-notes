const express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    mongoose = require('mongoose'),
    Note = require('./models/personalNotesModel'),
    User = require('./models/userModel'),//created model loading here
    bodyParser = require('body-parser');

require('./config/passport');

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/PersonalNoteDb', {useNewUrlParser: true})
    .then(res => console.log("Connected to DB"))
    .catch(err => console.log(err));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const routesNotes = require('./routes/api/personalNotesRoutes');
const routesUser = require('./routes/api/userRoutes');

//importing route
app.use('/api/', routesUser);
app.use('/api/notes', routesNotes);

app.listen(port);

console.log('Personal Notes RESTful API server started on: ' + port);
