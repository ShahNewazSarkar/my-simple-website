const express = require('express'); //A web-framework that provides functions for building web application
const bodyParser = require('body-parser');
const app = express(); //here app is an Express application object

// Import routes
const userRoutes = require('./routes/userRoutes'); 
const categoryRoutes = require('./routes/categoryRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const accountRoutes = require('./routes/accountRoutes');  
const transactionRoutes = require('./routes/transactionRoutes'); 
const budgetRoutes = require('./routes/budgetRoutes'); 
const authRoutes = require("./routes/authRoutes");
const logRoutes = require("./routes/logRoutes");

// Middleware
app.use(bodyParser.json());

// Use routes
app.use("/users", userRoutes);
app.use('/users', authRoutes);

app.use('/categories', categoryRoutes);
app.use('/expenses', expenseRoutes);
app.use('/accounts', accountRoutes);  // ✅ New Route
app.use('/transactions', transactionRoutes);  // ✅ New Route
app.use('/budgets', budgetRoutes);
app.use("/logs", logRoutes);



app.get("/cache/debug", (req, res) => {
  const localCache = require("./localCache");
  res.json(localCache.debugAll());
});

module.exports = app;
