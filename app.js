const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Import routes
const userRoutes = require('./routes/userRoutes'); 
const categoryRoutes = require('./routes/categoryRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const accountRoutes = require('./routes/accountRoutes');  // ✅ New Route
const transactionRoutes = require('./routes/transactionRoutes'); // ✅ New Route

// Middleware
app.use(bodyParser.json());

// Use routes
app.use("/users", userRoutes);
app.use('/categories', categoryRoutes);
app.use('/expenses', expenseRoutes);
app.use('/accounts', accountRoutes);  // ✅ New Route
app.use('/transactions', transactionRoutes);  // ✅ New Route

module.exports = app;
