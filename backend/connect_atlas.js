const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Schema references for seeding
const Admin = require('./models/Admin');
const Lead = require('./models/Lead');
const Activity = require('./models/Activity');
const Notification = require('./models/Notification');
const FollowUp = require('./models/FollowUp');

console.log('==================================================');
console.log('☁️  NEXUSCRM - MONGODB ATLAS CLOUD MIGRATION TOOL');
console.log('==================================================\n');

const envPath = path.join(__dirname, '.env');

// Setup interactive CLI reader
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Check if user passed the URI as an argument
const argUri = process.argv[2];

if (argUri) {
  handleMigration(argUri.trim());
} else {
  console.log('👉 Please paste your MongoDB Atlas Connection URI below.');
  console.log('   Example format: mongodb+srv://username:password@cluster0.abcde.mongodb.net/crm_db?retryWrites=true&w=majority\n');
  
  rl.question('🔗 Atlas connection string: ', (inputUri) => {
    rl.close();
    if (!inputUri || !inputUri.trim()) {
      console.error('\n❌ Error: No connection string provided. Migration cancelled.');
      process.exit(1);
    }
    handleMigration(inputUri.trim());
  });
}

async function handleMigration(mongoUri) {
  console.log('\n⏳ Initiating secure connection test to your cloud MongoDB instance...');
  
  try {
    // 1. Try connecting to the cloud instance
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoUri, {
      connectTimeoutMS: 10000 // 10s timeout
    });
    
    console.log('✅ Connection established successfully!');
    console.log(`📡 Cluster Host: ${mongoose.connection.host}`);
    console.log(`📁 Target Database: ${mongoose.connection.name || 'crm_db'}\n`);

    // 2. Clear old collections and Seed high-fidelity sample data
    console.log('🌱 Seeding fresh CRM metadata and demo items into Atlas...');
    
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

    console.log('   ✔ Admin account created successfully');

    // Create Leads
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
        createdAt: new Date(new Date().setMonth(new Date().getMonth() - 4))
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
        createdAt: new Date(new Date().setMonth(new Date().getMonth() - 3))
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
        createdAt: new Date(new Date().setMonth(new Date().getMonth() - 2))
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
        createdAt: new Date(new Date().setMonth(new Date().getMonth() - 1))
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
    console.log(`   ✔ ${seededLeads.length} sample leads populated`);

    // Create Activities
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
    console.log('   ✔ Activity history log set up');

    // Create Notifications
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
    console.log('   ✔ System alerts registered');

    // Create FollowUps
    const followups = [
      {
        leadId: seededLeads[0]._id,
        adminId: admin._id,
        title: `Follow-up with ${seededLeads[0].name}`,
        description: `Schedule design discovery call.`,
        dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
        status: 'Pending'
      },
      {
        leadId: seededLeads[1]._id,
        adminId: admin._id,
        title: `Touchpoint check-in with ${seededLeads[1].name}`,
        description: `Check-in on their feedback from our email proposal.`,
        dueDate: new Date(new Date().setDate(new Date().getDate() + 3)),
        status: 'Pending'
      }
    ];
    await FollowUp.insertMany(followups);
    console.log('   ✔ Scheduler checklist compiled');

    console.log('🚀 Seeding process completed successfully!');

    // Close Mongoose connection
    await mongoose.connection.close();

    // 3. Write new MONGO_URI to the backend environment (.env)
    console.log('\n📝 Storing new cloud URI to backend environment (.env)...');
    
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }

    const regex = /^MONGO_URI=.*$/m;
    const newLine = `MONGO_URI=${mongoUri}`;

    if (regex.test(envContent)) {
      envContent = envContent.replace(regex, newLine);
    } else {
      envContent += `\n${newLine}\n`;
    }

    fs.writeFileSync(envPath, envContent, 'utf8');
    console.log('   ✔ backend/.env file updated successfully!');

    console.log('\n==================================================');
    console.log('🎉 SUCCESS! YOUR CRM IS NOW RUNNING ON MONGODB ATLAS!');
    console.log('   Nodemon will automatically restart with the new cloud DB.');
    console.log('   - Demo Admin Account: admin@nexuscrm.com / password123');
    console.log('==================================================\n');

    process.exit(0);

  } catch (error) {
    console.error('\n❌ Connection Error: Could not connect to the cloud database.');
    console.error(`Reason: ${error.message}`);
    
    console.log('\n💡 Troubleshooting checklist:');
    console.log('1. Ensure your MongoDB Atlas password does not contain un-encoded special characters (e.g. @, :, /).');
    console.log('2. IMPORTANT: Did you add your IP address to the Atlas "IP Access List"?');
    console.log('   Log into cloud.mongodb.com -> Network Access -> Add IP Address -> Select "Allow Access from Anywhere" or "Add Current IP Address".');
    console.log('3. Ensure your connection URI is formatted correctly.');
    
    process.exit(1);
  }
}
