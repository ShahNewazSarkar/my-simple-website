'use strict';

const { faker } = require('@faker-js/faker');

module.exports = {
  async up(queryInterface, Sequelize) {
    let users = [];
    
    // Sample data arrays
    const names = ['John Doe', 'Alice Smith', 'Michael Brown', 'Emma Johnson', 'Robert Wilson', 'Sophia Garcia'];
    const emails = ['john@example.com', 'alice@example.com', 'michael@example.com', 'emma@example.com', 'robert@example.com', 'sophia@example.com'];
    const passwords = ['hashedpassword1', 'hashedpassword2', 'hashedpassword3', 'hashedpassword4', 'hashedpassword5', 'hashedpassword6'];

    for (let i = 0; i < 10000; i++) {
      const randomIndex = Math.floor(Math.random() * names.length);
      
      users.push({
        name: names[randomIndex],
        email: faker.internet.email(),  // Generate unique random email
        password: passwords[randomIndex], 
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    await queryInterface.bulkInsert('IndexedUsers', users, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('IndexedUsers', null, {});
  }
};
