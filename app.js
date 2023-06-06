var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')
const flash = require('connect-flash');
const passport = require('passport');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/Registration');
var mangeInstrctor = require('./routes/MangeUserRouters');
var mangeCourses = require('./routes/MangeCourses');
var student = require('./routes/student');
const cors = require('cors');
const mysql = require('mysql');
var app = express();
app.use(
    cors()
)
const oneDay = 1000 * 60 * 60 * 24;
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
 
  secret: '@LMS_Project',
  resave: true,
  saveUninitialized:false,
}))

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/regist',adminRouter);
app.use('/mangeInstrctor',mangeInstrctor);
app.use('/mangeCourses', mangeCourses);
app.use('/student',student)





 


module.exports = app;
