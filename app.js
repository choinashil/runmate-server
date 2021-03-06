const express = require('express');
const bodyParser = require('body-parser');
const createError = require('http-errors');
const mongoose = require('mongoose');
const logger = require('morgan');
const cors = require('cors');
const database = require('./config/database');
const token = require('./config/token');
const { DB_URI } = database;
const { SECRET_KEY } = token;

const app = express();

app.set('jwt-secret', SECRET_KEY);
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json({extended: true}));
app.use(bodyParser.urlencoded({extended: true}));

app.use('/api', require('./routes/api'));

const options = {
  useNewUrlParser: true,
  dbName: 'running-app'
};

mongoose.connect(DB_URI, options)
.then(() => console.log('Database connection established!'))
.catch(err => console.error(`Error connecting Database instance due to: ${err}`));


app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  const { status, name, message } = err;
  console.error(err);
  res.status(status || 500);
  res.json({
    name,
    message
  });
});

module.exports = app;
