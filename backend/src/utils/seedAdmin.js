import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Course from '../models/Course.js';

export const seedInitialData = async () => {
  try {
    const defaultCourses = [
      'B.tech', 'M.tech', 'BCA', 'MCA', 'B.sc', 'M.sc',
      'Bachelor of Science', 'Master of Science', 'Bachelor of Arts',
      'Master of Arts', 'Bachelor of Technology', 'Master of Business Administration'
    ];

    for (const courseName of defaultCourses) {
      const exists = await Course.findOne({ name: courseName });
      if (!exists) {
        await Course.create({ name: courseName, description: 'Pre-populated course.' });
      }
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminEmail || !adminPassword) {
      console.warn('ADMIN_EMAIL and ADMIN_PASSWORD are not configured; skipping admin bootstrap.');
      return;
    }

    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      await User.create({
        name: 'Master System Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin'
      });
      console.log('Master Admin account seeded successfully.');
    }
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};
