require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Course = require('../models/Course');
const User = require('../models/User');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  // Create admin user
  const adminEmail = 'admin@learnhub.local';
  const existing = await User.findOne({ email: adminEmail });
  if (!existing) {
    const admin = new User({
      name: 'Admin User',
      email: adminEmail,
      password: await bcrypt.hash('AdminPass123', 10),
      role: 'admin',
    });
    await admin.save();
    console.log('Created admin user:', adminEmail, 'password: AdminPass123');
  } else {
    console.log('Admin user already exists:', adminEmail);
  }

  // Seed sample courses
  const sample = [
    { title: 'Intro to JavaScript', description: 'Basics of JS', instructor: 'Course Team', category: 'Programming', level: 'beginner' },
    { title: 'React for Beginners', description: 'Build UIs with React', instructor: 'Course Team', category: 'Web Development', level: 'beginner' },
    { title: 'Data Science 101', description: 'Intro to data science', instructor: 'Course Team', category: 'Data Science', level: 'intermediate' },
  ];

  for (const c of sample) {
    const exists = await Course.findOne({ title: c.title });
    if (!exists) {
      await Course.create(c);
      console.log('Created course:', c.title);
    }
  }

  console.log('Seeding complete');
  process.exit(0);
};

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
