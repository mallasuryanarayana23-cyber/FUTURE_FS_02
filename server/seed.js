const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const Admin = require('./models/Admin');
const Lead = require('./models/Lead');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Clear existing data
    await Admin.deleteMany();
    await Lead.deleteMany();

    // Create Admin
    const admin = await Admin.create({
      name: 'Super Admin',
      email: 'admin@nexuscrm.com',
      password: 'password123'
    });

    // Create Sample Leads
    const leads = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
        company: 'Tech Solutions Inc',
        status: 'New',
        source: 'Website Contact Form'
      },
      {
        name: 'Jane Smith',
        email: 'jane@corporation.com',
        phone: '987-654-3210',
        company: 'Global Corp',
        status: 'Contacted',
        source: 'LinkedIn'
      },
      {
        name: 'Michael Brown',
        email: 'michael@startup.io',
        phone: '555-012-3456',
        company: 'Innovate AI',
        status: 'Converted',
        source: 'Referral'
      },
      {
        name: 'Sarah Wilson',
        email: 'sarah@design.co',
        phone: '444-555-6666',
        company: 'Creative Studio',
        status: 'Qualified',
        source: 'Website Contact Form'
      },
      {
        name: 'Robert Davis',
        email: 'robert@finance.net',
        phone: '222-333-4444',
        company: 'Capital Group',
        status: 'Closed',
        source: 'Direct Mail'
      }
    ];

    await Lead.insertMany(leads);

    console.log('Data Seeded Successfully!');
    console.log('Admin Email: admin@nexuscrm.com');
    console.log('Admin Password: password123');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
