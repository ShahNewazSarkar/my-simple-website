const { Category, Expense } = require('./models'); // Assuming models are set up
const { DataTypes } = require('sequelize');
// Function to generate random data
const generateRandomData = () => {
    const categoryNames = ['movie', 'lunch', 'ciggarette', 'bus', 'dress'];
    const randomName = categoryNames[Math.floor(Math.random() * categoryNames.length)]; // Random category name
    const user_id = Math.floor(Math.random() * 10) + 1; // Random user_id between 1 and 100
    const amount = parseFloat((Math.random() * (1000 - 10) + 10).toFixed(2)); // Random amount between 10 and 1000, rounded to 2 decimal places
  
    // Description corresponding to the category name
    const descriptions = {
      movie: 'Expense for watching a movie',
      lunch: 'Expense for having lunch',
      ciggarette: 'Expense for buying cigarettes',
      bus: 'Expense for bus fare',
      dress: 'Expense for buying a dress',
    };
    const description = descriptions[randomName]; // Get description based on category name
  
    return { user_id, name: randomName, amount, description };
  };
  
  // Function to populate the tables
  const populateTables = async () => {
    try {
      const totalRecords = 10000;
      for (let i = 0; i < totalRecords; i++) {
        const { user_id, name, amount, description } = generateRandomData();
  
        // Check if the category already exists for the user
        let category = await Category.findOne({ where: { user_id, name } });
  
        if (!category) {
          // Create a new category if it doesn't exist
          category = await Category.create({ user_id, name, amount });
        } else {
          // Update the existing category's amount
          category.amount = parseFloat(category.amount) + amount;
          await category.save();
        }
  
        // Create a new expense record
        await Expense.create({
          user_id,
          category_id: category.id,
          amount,
          description,
        });
  
        // Log progress
        if (i % 1000 === 0) {
          console.log(`Inserted ${i} records...`);
        }
      }
  
      console.log('Data population completed successfully.');
    } catch (error) {
      console.error('Error populating tables:', error);
    } 
  };
  
  // Run the script
  populateTables();