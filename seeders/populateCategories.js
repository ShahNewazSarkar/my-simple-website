const { Category } = require('../models');

const categories = [
  { name: 'Food & Dining' },
  { name: 'Transport' },
  { name: 'Utilities' },
  { name: 'Entertainment' },
  { name: 'Shopping' },
  { name: 'Health & Fitness' },
  { name: 'Education' },
  { name: 'Travel' },
  { name: 'Bills & Payments' },
  { name: 'Groceries' },
  { name: 'Personal Care' },
  { name: 'Insurance' }
];

async function populateCategories() {
  try {
    // Check if categories already exist
    const existingCount = await Category.count();
    if (existingCount > 0) {
      console.log('Categories already exist, skipping seed.');
      return;
    }

    // Bulk create categories
    await Category.bulkCreate(categories);
    console.log('✅ Categories seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding categories:', error.message);
  }
}

module.exports = populateCategories;
