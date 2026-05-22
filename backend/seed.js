const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const Admin = require('./models/Admin');
const Lead = require('./models/Lead');
const Activity = require('./models/Activity');
const Notification = require('./models/Notification');
const FollowUp = require('./models/FollowUp');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Clear existing data
    await Admin.deleteMany();
    await Lead.deleteMany();
    await Activity.deleteMany();
    await Notification.deleteMany();
    await FollowUp.deleteMany();

    // Create Admin
    const admin = await Admin.create({
      name: 'Super Admin',
      email: 'admin@nexuscrm.com',
      password: 'password123'
    });

    console.log('Admin user created successfully');

    // Create Sample Leads with expanded fields
    const leads = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
        company: 'Tech Solutions Inc',
        status: 'New',
        priority: 'High',
        source: 'Website Contact Form',
        tags: ['Enterprise', 'SaaS'],
        assignedAdmin: admin._id,
        createdAt: new Date(new Date().setMonth(new Date().getMonth() - 4)) // 4 months ago
      },
      {
        name: 'Jane Smith',
        email: 'jane@corporation.com',
        phone: '987-654-3210',
        company: 'Global Corp',
        status: 'Contacted',
        priority: 'Medium',
        source: 'LinkedIn',
        tags: ['Corporate', 'Consulting'],
        assignedAdmin: admin._id,
        createdAt: new Date(new Date().setMonth(new Date().getMonth() - 3)) // 3 months ago
      },
      {
        name: 'Michael Brown',
        email: 'michael@startup.io',
        phone: '555-012-3456',
        company: 'Innovate AI',
        status: 'Converted',
        priority: 'High',
        source: 'Referral',
        tags: ['AI', 'Tech'],
        assignedAdmin: admin._id,
        createdAt: new Date(new Date().setMonth(new Date().getMonth() - 2)) // 2 months ago
      },
      {
        name: 'Sarah Wilson',
        email: 'sarah@design.co',
        phone: '444-555-6666',
        company: 'Creative Studio',
        status: 'Qualified',
        priority: 'Low',
        source: 'Website Contact Form',
        tags: ['Design', 'Agency'],
        assignedAdmin: admin._id,
        createdAt: new Date(new Date().setMonth(new Date().getMonth() - 1)) // 1 month ago
      },
      {
        name: 'Robert Davis',
        email: 'robert@finance.net',
        phone: '222-333-4444',
        company: 'Capital Group',
        status: 'Proposal Sent',
        priority: 'High',
        source: 'Direct Mail',
        tags: ['Finance', 'Investment'],
        assignedAdmin: admin._id,
        createdAt: new Date()
      },
      {
        name: 'Alice Johnson',
        email: 'alice@cloudservices.com',
        phone: '777-888-9999',
        company: 'Cloud Services LLC',
        status: 'Negotiation',
        priority: 'Medium',
        source: 'Cold Email',
        tags: ['Infrastructure', 'Cloud'],
        assignedAdmin: admin._id,
        createdAt: new Date()
      }
    ];

    const seededLeads = await Lead.insertMany(leads);
    console.log(`${seededLeads.length} sample leads created successfully`);

    // Create Sample Activities
    const activities = [
      {
        leadId: seededLeads[0]._id,
        adminId: admin._id,
        adminName: admin.name,
        action: 'Lead Created',
        description: `Created new lead: John Doe (Tech Solutions Inc)`
      },
      {
        leadId: seededLeads[1]._id,
        adminId: admin._id,
        adminName: admin.name,
        action: 'Status Updated',
        description: `Changed status of Jane Smith from New to Contacted`
      },
      {
        leadId: seededLeads[2]._id,
        adminId: admin._id,
        adminName: admin.name,
        action: 'Note Added',
        description: `Added a note to lead Michael Brown: 'Highly interested in standard setup.'`
      }
    ];
    await Activity.insertMany(activities);
    console.log('Sample activity logs seeded');

    // Create Sample Notifications
    const notifications = [
      {
        adminId: admin._id,
        title: 'New Lead Generated',
        message: 'Robert Davis from Capital Group has submitted a contact request.',
        type: 'success',
        isRead: false
      },
      {
        adminId: admin._id,
        title: 'Follow-up Due Soon',
        message: 'Schedule follow-up check-in with John Doe.',
        type: 'reminder',
        isRead: false
      }
    ];
    await Notification.insertMany(notifications);
    console.log('Sample notifications seeded');

    // Create Sample FollowUps
    const followups = [
      {
        leadId: seededLeads[0]._id,
        adminId: admin._id,
        title: `Follow-up with ${seededLeads[0].name}`,
        description: `Schedule design discovery call.`,
        dueDate: new Date(new Date().setDate(new Date().getDate() + 1)), // tomorrow
        status: 'Pending'
      },
      {
        leadId: seededLeads[1]._id,
        adminId: admin._id,
        title: `Touchpoint check-in with ${seededLeads[1].name}`,
        description: `Check-in on their feedback from our email proposal.`,
        dueDate: new Date(new Date().setDate(new Date().getDate() + 3)), // 3 days from now
        status: 'Pending'
      }
    ];
    await FollowUp.insertMany(followups);
    console.log('Sample followups seeded');

    console.log('\nData Seeded Successfully!');
    console.log('Admin Email: admin@nexuscrm.com');
    console.log('Admin Password: password123');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
