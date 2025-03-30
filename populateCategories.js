const { Category } = require('./models');

const populateCategories = async () => {
  try {
    const categories = [];
    for (let i = 1; i <= 5000; i++) { // Adjust the loop for the desired amount of data
      categories.push({
        user_id: 1, // Random user_id between 1 and 20
        name: `Category ${i}`,
        description: `Description for category ${i}`,
        amount: Math.floor(Math.random() * 1000), // Random amount between 0 and 1000
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    console.time('Write Operation'); // Start timer
    await Category.bulkCreate(categories); // Bulk insert data
    console.timeEnd('Write Operation'); // End timer and log time

    console.log('Categories populated successfully!');
  } catch (error) {
    console.error('Error populating categories:', error);
  }
};

populateCategories();
