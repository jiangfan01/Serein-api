const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
//注册.env文件
require('dotenv').config()

//认证中间件，相当于路由守卫认证token
const adminAuth = require("./middlewares/admin-auth")

//  前台路由
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const uploadsRouter = require("./routes/uploads");

//  后台路由
const adminChartsRouter = require('./routes/admin/charts');
const adminArticlesRouter = require('./routes/admin/articles');
const adminCategoriesRouter = require('./routes/admin/categories');
const adminChaptersRouter = require('./routes/admin/chapters');
const adminCoursesRouter = require('./routes/admin/courses');
const adminUsersRouter = require('./routes/admin/users');
const adminAuthRouter = require('./routes/admin/auth');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//  前台
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/uploads',uploadsRouter)

//  后台
app.use('/admin/charts',adminAuth(), adminChartsRouter);
app.use('/admin/articles',adminAuth(), adminArticlesRouter);
app.use('/admin/categories',adminAuth(), adminCategoriesRouter);
app.use('/admin/chapters',adminAuth(), adminChaptersRouter);
app.use('/admin/courses', adminAuth(),adminCoursesRouter);
app.use('/admin/users',adminAuth(), adminUsersRouter);
app.use('/admin/auth', adminAuthRouter);

module.exports = app;
